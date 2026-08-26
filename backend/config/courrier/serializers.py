from rest_framework import serializers
from drf_dynamic_fields import DynamicFieldsMixin
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import (
    PieceJointe, DocumentFinal, Societe, Personnel, Utilisateur,
    CourrierEntrant, CourrierSortant, Profil,
)

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


class ProfilSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = Profil
        fields = ["id", "nom", "role", "role_display"]


class UtilisateurSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    """
    Serializer pour la gestion des comptes utilisateurs (création/édition par un admin).
    Le mot de passe n'est jamais renvoyé en lecture et est toujours hashé à l'écriture.
    """
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    profil_detail = ProfilSerializer(source='profil', read_only=True)
    personnel_nom = serializers.CharField(source='personnel.nom_prenom', read_only=True, default=None)

    class Meta:
        model = Utilisateur
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "is_active", "is_staff", "is_superuser",
            "personnel", "personnel_nom", "profil", "profil_detail",
            "password", "date_joined", "last_login",
        ]
        read_only_fields = ["date_joined", "last_login", "is_superuser"]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        user = Utilisateur(**validated_data)
        user.set_password(password or Utilisateur.objects.make_random_password())
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Authentification par email + mot de passe (AUTH_USER_MODEL.USERNAME_FIELD = 'email').
    Ajoute le rôle et les infos utilisateur dans le token ET dans la réponse.
    """

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["username"] = user.username
        token["role"] = user.profil.role if user.profil else None
        token["nom"] = (
            user.personnel.nom_prenom if user.personnel else f"{user.first_name} {user.last_name}".strip()
        )
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data["user"] = {
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
        }
        return data
   

class SocieteSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = Societe
        fields = '__all__'


class PersonnelSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = Personnel
        fields = '__all__'