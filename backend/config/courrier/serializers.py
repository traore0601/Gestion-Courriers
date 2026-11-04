from rest_framework import serializers
from drf_dynamic_fields import DynamicFieldsMixin
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import (
    Societe,
    Personnel,
    TypeStructure,
    Structure,
    CourrierSortant,
    CourrierEntrant,
    PlanningTravaux,
    DocumentFinal,
    PieceJointe,
    Ampliateur,
    Profil,
    Utilisateur,
    PageMenu,
    Permission,
    Notification,
)


def get_photo_url(user, request=None):
    """Construit l'URL absolue de la photo de profil de l'utilisateur (via Personnel)."""
    if not user.personnel or not user.personnel.photo:
        return None
    url = user.personnel.photo.url
    if not url.startswith('/media/'):
        url = f"/media/{url.lstrip('/')}"
    if request is not None:
        return request.build_absolute_uri(url)
    return f"http://127.0.0.1:8000{url}"


# --- SERIALIZERS DE BASE ---

class SocieteSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = Societe
        fields = '__all__'


class PersonnelSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    nom_complet = serializers.CharField(source='nom_prenom', read_only=True)

    class Meta:
        model = Personnel
        fields = '__all__'


class TypeStructureSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = TypeStructure
        fields = '__all__'


class StructureSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    responsable_detail = PersonnelSerializer(source='responsable', read_only=True)

    class Meta:
        model = Structure
        fields = '__all__'


class PieceJointeSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    url_complete = serializers.SerializerMethodField()

    class Meta:
        model = PieceJointe
        fields = "__all__"

    def get_url_complete(self, obj):
        if obj.repertoire_pj:
            url = obj.repertoire_pj.url
            if not url.startswith('/media/'):
                url = f"/media/{url.lstrip('/')}"
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(url)
            return f"http://127.0.0.1:8000{url}"
        return ""


class DocumentFinalSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    url_complete = serializers.SerializerMethodField()

    class Meta:
        model = DocumentFinal
        fields = "__all__"

    def get_url_complete(self, obj):
        if obj.repertoire_document:
            url = obj.repertoire_document.url
            if not url.startswith('/media/'):
                url = f"/media/{url.lstrip('/')}"
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(url)
            return f"http://127.0.0.1:8000{url}"
        return ""


class AmpliateurSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    personnel_detail = PersonnelSerializer(source='personnel', read_only=True)

    class Meta:
        model = Ampliateur
        fields = '__all__'


# --- SERIALIZERS COURRIERS ---

class CourrierEntrantSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    pieces_jointes = PieceJointeSerializer(many=True, read_only=True)
    documents_finaux = DocumentFinalSerializer(many=True, read_only=True)
    
    # Détails en lecture seule (GET)
    personnel_detail = PersonnelSerializer(source='personnel', read_only=True)
    ampliateurs_details = AmpliateurSerializer(source='ampliateurs', many=True, read_only=True)

    # Champ temporaire pour recevoir la liste d'IDs des ampliateurs lors de la création/modification
    ampliateurs_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = CourrierEntrant
        fields = "__all__"

    def _notifier_personnel(self, courrier, personnel_id, type_notif, titre, message):
        """Helper pour créer une notification à l'attention d'un membre du personnel."""
        try:
            # Récupération de l'utilisateur lié au personnel
            destinataire = Utilisateur.objects.get(personnel_id=personnel_id)
            Notification.objects.create(
                destinataire=destinataire,
                type_notification=type_notif,
                titre=titre,
                message=message,
                # Ajuster le lien ou la référence selon la structure exacte de votre modèle Notification
            )
        except Utilisateur.DoesNotExist:
            pass

    def _notifier_destinataire_et_ampliateurs(self, courrier, ampliateurs_ids):
        """Helper appelé lors de la création d'un courrier entrant."""
        # 1. Notifier le destinataire principal
        if courrier.personnel_id:
            self._notifier_personnel(
                courrier,
                courrier.personnel_id,
                Notification.Type.INFO,
                "Nouveau courrier assigné",
                f"Le courrier « {courrier.objet} » (réf. {courrier.reference}) vous a été assigné."
            )

        # 2. Notifier les ampliateurs
        for personnel_id in ampliateurs_ids:
            self._notifier_personnel(
                courrier,
                personnel_id,
                Notification.Type.INFO,
                "Vous êtes mis en copie (ampliation)",
                f"Le courrier « {courrier.objet} » (réf. {courrier.reference}) vous a été transmis en ampliation."
            )

    def create(self, validated_data):
        ampliateurs_ids = validated_data.pop('ampliateurs_ids', [])
        courrier = CourrierEntrant.objects.create(**validated_data)

        for personnel_id in ampliateurs_ids:
            Ampliateur.objects.create(
                courrier_entrant=courrier,
                personnel_id=personnel_id
            )

        self._notifier_destinataire_et_ampliateurs(courrier, ampliateurs_ids)
        return courrier

    def update(self, instance, validated_data):
        ampliateurs_ids = validated_data.pop('ampliateurs_ids', None)

        # Repère si le destinataire principal change, pour ne notifier que le nouveau
        ancien_personnel_id = instance.personnel_id
        instance = super().update(instance, validated_data)

        nouveaux_ampliateurs = []
        if ampliateurs_ids is not None:
            anciens_ids = set(
                Ampliateur.objects.filter(courrier_entrant=instance)
                .values_list('personnel_id', flat=True)
            )
            Ampliateur.objects.filter(courrier_entrant=instance).delete()
            for personnel_id in ampliateurs_ids:
                Ampliateur.objects.create(
                    courrier_entrant=instance,
                    personnel_id=personnel_id
                )
            # On ne notifie que les ampliateurs nouvellement ajoutés
            nouveaux_ampliateurs = [pid for pid in ampliateurs_ids if pid not in anciens_ids]

        if instance.personnel_id and instance.personnel_id != ancien_personnel_id:
            self._notifier_personnel(
                instance,
                instance.personnel_id,
                Notification.Type.INFO,
                "Courrier réassigné",
                f"Le courrier « {instance.objet} » (réf. {instance.reference}) vous a été assigné.",
            )

        for personnel_id in nouveaux_ampliateurs:
            self._notifier_personnel(
                instance,
                personnel_id,
                Notification.Type.INFO,
                "Vous êtes mis en copie (ampliation)",
                f"Le courrier « {instance.objet} » (réf. {instance.reference}) vous a été transmis en ampliation.",
            )

        return instance


class CourrierSortantSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    pieces_jointes = PieceJointeSerializer(many=True, read_only=True)
    documents_finaux = DocumentFinalSerializer(many=True, read_only=True)
    personnel_detail = PersonnelSerializer(source='personnel', read_only=True)

    class Meta:
        model = CourrierSortant
        fields = "__all__"


class PlanningTravauxSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = PlanningTravaux
        fields = '__all__'


# --- SERIALIZERS AUTHENTIFICATION & UTILISATEURS ---

class ProfilSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = Profil
        fields = '__all__'


class UtilisateurSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    personnel_detail = PersonnelSerializer(source='personnel', read_only=True)
    profil_detail = ProfilSerializer(source='profil', read_only=True)
    role = serializers.CharField(source='profil.role', read_only=True, default=None)
    role_display = serializers.CharField(source='profil.get_role_display', read_only=True, default=None)
    nom_complet = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Utilisateur
        fields = "__all__"
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def get_nom_complet(self, obj):
        if obj.personnel:
            return obj.personnel.nom_prenom
        return f"{obj.first_name} {obj.last_name}".strip() or obj.username

    def get_photo_url(self, obj):
        request = self.context.get('request')
        return get_photo_url(obj, request)

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        utilisateur = Utilisateur(**validated_data)
        if password:
            utilisateur.set_password(password)
        else:
            utilisateur.set_unusable_password()
        utilisateur.save()
        return utilisateur

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class UtilisateurTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = Utilisateur.USERNAME_FIELD

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields[self.username_field] = serializers.CharField(write_only=True)
        if 'username' in self.fields and self.username_field != 'username':
            self.fields['username'].required = False

    def validate(self, attrs):
        if 'username' in attrs and self.username_field not in attrs:
            attrs[self.username_field] = attrs['username']

        data = super().validate(attrs)

        user = self.user
        role = user.profil.role if user.profil else None
        role_display = user.profil.get_role_display() if user.profil else None
        nom_complet = (
            user.personnel.nom_prenom
            if user.personnel
            else (f"{user.first_name} {user.last_name}".strip() or user.username)
        )

        data["utilisateur_id"] = user.id
        data["email"] = user.email
        data["username"] = user.username
        data["role"] = role
        if user.personnel:
            data["personnel_nom"] = user.personnel.nom_prenom

        data["user"] = {
            "id": user.id,
            "email": user.email,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
            "role": role,
            "role_display": role_display,
            "nom_complet": nom_complet,
            "personnel": user.personnel_id,
            "photo_url": get_photo_url(user, self.context.get("request")),
        }

        return data


class PageMenuSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = PageMenu
        fields = '__all__'


class PermissionSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    pagemenu_detail = PageMenuSerializer(source='pagemenu', read_only=True)
    profil_detail = ProfilSerializer(source='profil', read_only=True)

    class Meta:
        model = Permission
        fields = '__all__'


class NotificationSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    type_display = serializers.CharField(
        source='get_type_notification_display', read_only=True
    )
    time_ago = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['destinataire', 'date_creation']

    def get_time_ago(self, obj):
        from django.utils.timesince import timesince
        return f"il y a {timesince(obj.date_creation)}"
