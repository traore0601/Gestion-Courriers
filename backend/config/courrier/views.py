from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import (
    Societe, Personnel, CourrierSortant, CourrierEntrant,
    Utilisateur, PieceJointe, DocumentFinal
)
from .serializers import (
    SocieteSerializer, PersonnelSerializer, UtilisateurSerializer,
    CourrierSortantSerializer, CourrierEntrantSerializer,
    PieceJointeSerializer, DocumentFinalSerializer
)


@api_view(['GET'])
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


class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer