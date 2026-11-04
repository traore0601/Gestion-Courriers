from django.db.models import Q
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.parsers import MultiPartParser, FormParser

from .models import (
    Societe, Personnel, CourrierSortant, CourrierEntrant,
    Utilisateur, PieceJointe, Notification, DocumentFinal
)
from .serializers import (
    SocieteSerializer, PersonnelSerializer, UtilisateurSerializer,
    CourrierSortantSerializer, CourrierEntrantSerializer,
    PieceJointeSerializer, DocumentFinalSerializer, NotificationSerializer,
    UtilisateurTokenObtainPairSerializer, get_photo_url
)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def test_connection(request):
    return Response({"message": "Connexion réussie entre React et Django !"})


class CourrierEntrantViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CourrierEntrantSerializer

    def get_queryset(self):
        user = self.request.user

        queryset = CourrierEntrant.objects.all().select_related(
            'societe', 'personnel'
        ).prefetch_related('ampliateurs', 'pieces_jointes')

        if user.is_superuser or (hasattr(user, 'profil') and user.profil and user.profil.role in ["ADMIN", "SECRETAIRE"]):
            return queryset.order_by('-date_creation')

        if hasattr(user, 'personnel') and user.personnel:
            return queryset.filter(
                Q(personnel=user.personnel) | Q(ampliateurs__personnel=user.personnel)
            ).distinct().order_by('-date_creation')

        return CourrierEntrant.objects.none()

    def perform_create(self, serializer):
        # 1. Enregistrement du courrier entrant
        courrier = serializer.save()

        # 2. Notification pour le destinataire principal
        if courrier.personnel:
            # Recherche de l'utilisateur rattaché au membre du personnel
            user_destinataire = Utilisateur.objects.filter(personnel=courrier.personnel).first()
            if user_destinataire:
                Notification.objects.create(
                    destinataire=user_destinataire,
                    titre="Nouveau courrier entrant",
                    message=f"Vous avez reçu le courrier n°{courrier.id} : {courrier.objet or 'Sans objet'}.",
                )

        # 3. Notifications pour les ampliateurs
        for ampliateur in courrier.ampliateurs.all():
            if hasattr(ampliateur, 'personnel') and ampliateur.personnel:
                user_amp = Utilisateur.objects.filter(personnel=ampliateur.personnel).first()
                if user_amp:
                    Notification.objects.create(
                        destinataire=user_amp,
                        titre="Courrier en ampliation",
                        message=f"Vous êtes ampliateur sur le courrier n°{courrier.id} : {courrier.objet or 'Sans objet'}.",
                    )


class CourrierSortantViewSet(viewsets.ModelViewSet):
    queryset = CourrierSortant.objects.all().select_related('societe', 'personnel')
    serializer_class = CourrierSortantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # 1. Enregistrement du courrier sortant
        courrier = serializer.save()

        # 2. Notification au destinataire si c'un membre du personnel interne
        if courrier.personnel:
            user_destinataire = Utilisateur.objects.filter(personnel=courrier.personnel).first()
            if user_destinataire:
                Notification.objects.create(
                    destinataire=user_destinataire,
                    titre="Nouveau courrier sortant",
                    message=f"Un courrier sortant vous a été attribué (n°{courrier.id}) : {courrier.objet or 'Sans objet'}.",
                )


class PieceJointeViewSet(viewsets.ModelViewSet):
    queryset = PieceJointe.objects.all()
    serializer_class = PieceJointeSerializer
    parser_classes = (MultiPartParser, FormParser)


class DocumentFinalViewSet(viewsets.ModelViewSet):
    queryset = DocumentFinal.objects.all()
    serializer_class = DocumentFinalSerializer
    parser_classes = (MultiPartParser, FormParser)


class SocieteViewSet(viewsets.ModelViewSet):
    queryset = Societe.objects.all()
    serializer_class = SocieteSerializer


class PersonnelViewSet(viewsets.ModelViewSet):
    queryset = Personnel.objects.all()
    serializer_class = PersonnelSerializer


class IsAdminOrDG(permissions.BasePermission):
    """Seuls les profils ADMIN ou DG peuvent gérer les comptes utilisateurs."""

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if user.is_superuser:
            return True
        return bool(hasattr(user, 'profil') and user.profil and user.profil.role in ("ADMIN", "DG"))


class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.select_related('profil', 'personnel').all()
    serializer_class = UtilisateurSerializer
    permission_classes = [IsAdminOrDG]


class UtilisateurTokenObtainPairView(TokenObtainPairView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UtilisateurTokenObtainPairSerializer


class LogoutView(APIView):
    """POST {refresh} -> invalide le refresh token (blacklist)."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "Le champ 'refresh' est requis."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response(
                {"detail": "Token invalide ou déjà expiré."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response({"detail": "Déconnexion réussie."}, status=status.HTTP_205_RESET_CONTENT)


class MeView(APIView):
    """GET -> informations sur l'utilisateur actuellement authentifié."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_superuser": user.is_superuser,
            "is_staff": user.is_staff,
            "role": user.profil.role if hasattr(user, 'profil') and user.profil else None,
            "role_display": user.profil.get_role_display() if hasattr(user, 'profil') and user.profil else None,
            "nom_complet": (
                user.personnel.nom_prenom
                if hasattr(user, 'personnel') and user.personnel
                else (f"{user.first_name} {user.last_name}".strip() or user.username)
            ),
            "personnel": user.personnel_id if hasattr(user, 'personnel_id') else None,
            "photo_url": get_photo_url(user, request),
        }
        return Response(data)


class NotificationViewSet(viewsets.ModelViewSet):
    """
    GET    /api/notifications/               -> mes notifications (plus récentes en premier)
    GET    /api/notifications/unread_count/   -> {"unread_count": N}
    POST   /api/notifications/mark_all_read/  -> tout marquer comme lu
    POST   /api/notifications/{id}/mark_read/ -> marquer une notification comme lue
    DELETE /api/notifications/{id}/           -> supprimer une notification
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(
            destinataire=self.request.user
        ).order_by('-date_creation')

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = self.get_queryset().filter(is_read=False).count()
        return Response({"unread_count": count})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response({"detail": "Toutes les notifications ont été marquées comme lues."})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        if not notif.is_read:
            notif.is_read = True
            notif.save(update_fields=['is_read'])
        return Response(self.get_serializer(notif).data)


class DashboardViewSet(viewsets.ViewSet):
    """
    ViewSet pour la gestion du tableau de bord.
    GET /api/dashboard/stats-destinataire/
    """
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='stats-destinataire')
    def stats_destinataire(self, request):
        user = request.user

        if user.is_superuser or (hasattr(user, 'profil') and user.profil and user.profil.role in ["ADMIN", "SECRETAIRE"]):
            courriers = CourrierEntrant.objects.all()
        elif hasattr(user, 'personnel') and user.personnel:
            courriers = CourrierEntrant.objects.filter(
                Q(personnel=user.personnel) | Q(ampliateurs__personnel=user.personnel)
            ).distinct()
        else:
            courriers = CourrierEntrant.objects.none()

        stats = {
            "total_recus": courriers.count(),
            "non_lus": courriers.filter(is_read=False).count() if hasattr(CourrierEntrant, 'is_read') else 0,
            "traites": courriers.filter(statut="TRAITE").count() if hasattr(CourrierEntrant, 'statut') else 0,
            "en_attente": courriers.filter(statut="EN_ATTENTE").count() if hasattr(CourrierEntrant, 'statut') else 0,
        }

        return Response(stats, status=status.HTTP_200_OK)