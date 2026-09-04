from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from .serializers import UtilisateurTokenObtainPairSerializer
from rest_framework.parsers import MultiPartParser, FormParser

from .models import (
    Societe, Personnel, CourrierSortant, CourrierEntrant,
    Utilisateur, PieceJointe, DocumentFinal
)
from .serializers import (
    SocieteSerializer, PersonnelSerializer, UtilisateurSerializer,
    CourrierSortantSerializer, CourrierEntrantSerializer,
    PieceJointeSerializer, DocumentFinalSerializer, get_photo_url,
)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def test_connection(request):
    return Response({"message": "Connexion réussie entre React et Django !"})


class CourrierEntrantViewSet(viewsets.ModelViewSet):
    # Suppression du prefetch_related problématique
    queryset = CourrierEntrant.objects.all().select_related('societe', 'personnel')
    serializer_class = CourrierEntrantSerializer


class CourrierSortantViewSet(viewsets.ModelViewSet):
    queryset = CourrierSortant.objects.all().select_related('societe', 'personnel')
    serializer_class = CourrierSortantSerializer


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
        return bool(user.profil and user.profil.role in ("ADMIN", "DG"))


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
            "role": user.profil.role if user.profil else None,
            "role_display": user.profil.get_role_display() if user.profil else None,
            "nom_complet": (
                user.personnel.nom_prenom
                if user.personnel
                else (f"{user.first_name} {user.last_name}".strip() or user.username)
            ),
            "personnel": user.personnel_id,
            "photo_url": get_photo_url(user, request),
        }
        return Response(data)