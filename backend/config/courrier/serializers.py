from rest_framework import serializers
from drf_dynamic_fields import DynamicFieldsMixin
from .models import PieceJointe, DocumentFinal, Societe, Personnel, Utilisateur, CourrierEntrant, CourrierSortant
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


def get_photo_url(user, request=None):
    """Construit l'URL absolue de la photo de profil de l'utilisateur (via Personnel), si elle existe."""
    if not user.personnel or not user.personnel.photo:
        return None
    url = user.personnel.photo.url
    if not url.startswith('/media/'):
        url = f"/media/{url.lstrip('/')}"
    if request is not None:
        return request.build_absolute_uri(url)
    return f"http://127.0.0.1:8000{url}"


class PersonnelSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = Personnel
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


class CourrierEntrantSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    pieces_jointes = PieceJointeSerializer(many=True, read_only=True)
    documents_finaux = DocumentFinalSerializer(many=True, read_only=True)

    class Meta:
        model = CourrierEntrant
        fields = "__all__"


class CourrierSortantSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    pieces_jointes = PieceJointeSerializer(many=True, read_only=True)
    documents_finaux = DocumentFinalSerializer(many=True, read_only=True)

    class Meta:
        model = CourrierSortant
        fields = "__all__"


class UtilisateurSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    personnel_detail = PersonnelSerializer(source='personnel', read_only=True)
    profil_role = serializers.CharField(source='profil.role', read_only=True, default=None)
    profil_role_display = serializers.CharField(source='profil.get_role_display', read_only=True, default=None)

    class Meta:
        model = Utilisateur
        fields = "__all__"
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}  # Empêche le mot de passe d'être exposé en réponse JSON
        }

    def create(self, validated_data):
        # Utilise create_user pour garantir le HACHAGE du mot de passe lors de la création via l'API
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


class SocieteSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = Societe
        fields = '__all__'


class UtilisateurTokenObtainPairSerializer(TokenObtainPairSerializer):
    # Redéfinition du champ username de SimpleJWT pour accepter l'Email
    username_field = Utilisateur.USERNAME_FIELD  # Pointe vers "email"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Permet d'accepter soit "email" soit "username" venant de la requête JSON React
        self.fields[self.username_field] = serializers.CharField(write_only=True)
        if 'username' in self.fields and self.username_field != 'username':
            self.fields['username'].required = False

    def validate(self, attrs):
        # Si le client React envoie la clé "username" au lieu de "email", on la mappe correctement
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

        # Clés "à plat" (compatibilité avec un éventuel client existant)
        data["utilisateur_id"] = user.id
        data["email"] = user.email
        data["username"] = user.username
        data["role"] = role
        if user.personnel:
            data["personnel_nom"] = user.personnel.nom_prenom

        # Objet "user" structuré (utilisé par la page de connexion React)
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