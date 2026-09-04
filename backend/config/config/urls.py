from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from courrier.views import UtilisateurTokenObtainPairView, LogoutView, MeView

# Importation des ViewSets
from courrier.views import (
    SocieteViewSet, 
    test_connection, 
    PersonnelViewSet, 
    CourrierEntrantViewSet, 
    CourrierSortantViewSet, 
    UtilisateurViewSet,
    PieceJointeViewSet,
    DocumentFinalViewSet,
)

# Création du routeur DRF
router = DefaultRouter()
router.register(r"societes", SocieteViewSet, basename="societe")
router.register(r"personnels", PersonnelViewSet, basename="personnel")
router.register(r"courriers-entrants", CourrierEntrantViewSet, basename="courrier-entrant")
router.register(r"courriers-sortants", CourrierSortantViewSet, basename="courrier-sortant")
router.register(r"utilisateurs", UtilisateurViewSet, basename="utilisateur")
router.register(r"pieces-jointes", PieceJointeViewSet, basename="piece-jointe")
router.register(r"documents-finaux", DocumentFinalViewSet, basename="document-final")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("courrier/", test_connection), 
    path("api/", include(router.urls)),
    path("api/token/", UtilisateurTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/logout/", LogoutView.as_view(), name="token_logout"),
    path("api/me/", MeView.as_view(), name="me"),
]

# Permet à Django de servir les fichiers média (images, PDF) en mode DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)