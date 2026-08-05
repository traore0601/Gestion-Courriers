from rest_framework import serializers
from .models import Societe, Personnel,Utilisateur, CourrierEntrant, CourrierSortant  # cette section me permet d' importe la table depuis models.py
from drf_dynamic_fields import DynamicFieldsMixin



class CourrierEntrantSerializer(DynamicFieldsMixin,serializers.ModelSerializer):
    class Meta:
            model = CourrierEntrant
            fields = "__all__" 

class CourrierSortantSerializer(DynamicFieldsMixin,serializers.ModelSerializer):
    class Meta:
            model = CourrierSortant
            fields = "__all__" 

class UtilisateurSerializer(DynamicFieldsMixin,serializers.ModelSerializer):
    class Meta:
            model = Utilisateur
            fields = "__all__" 
   
class SocieteSerializer(DynamicFieldsMixin,serializers.ModelSerializer):
    class Meta:
        model = Societe
        fields = '__all__'

class PersonnelSerializer(DynamicFieldsMixin,serializers.ModelSerializer):
    class Meta:
        model = Personnel
        fields = '__all__'

 


        