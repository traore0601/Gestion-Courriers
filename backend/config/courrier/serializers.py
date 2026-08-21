from rest_framework import serializers
from drf_dynamic_fields import DynamicFieldsMixin
from .models import PieceJointe, DocumentFinal, Societe, Personnel, Utilisateur, CourrierEntrant, CourrierSortant

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
    class Meta:
        model = Utilisateur
        fields = "__all__" 
   

class SocieteSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = Societe
        fields = '__all__'


class PersonnelSerializer(DynamicFieldsMixin, serializers.ModelSerializer):
    class Meta:
        model = Personnel
        fields = '__all__'