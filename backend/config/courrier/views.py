from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Societe, Personnel,CourrierSortant,CourrierEntrant,Utilisateur
from .serializers import SocieteSerializer, PersonnelSerializer, UtilisateurSerializer,CourrierSortantSerializer, CourrierEntrantSerializer


@api_view(['GET'])
def test_connection(request):
    return Response({"message": "Connexion réussie entre React et Django !"})

class CourrierEntrantViewSet(viewsets.ModelViewSet):
    queryset = CourrierEntrant.objects.all()
    serializer_class = CourrierEntrantSerializer

class CourrierSortantViewSet(viewsets.ModelViewSet):
    queryset = CourrierSortant.objects.all()
    serializer_class = CourrierSortantSerializer

class SocieteViewSet(viewsets.ModelViewSet):
    queryset = Societe.objects.all()
    serializer_class = SocieteSerializer

class PersonnelViewSet(viewsets.ModelViewSet):
    queryset = Personnel.objects.all()
    serializer_class = PersonnelSerializer

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
