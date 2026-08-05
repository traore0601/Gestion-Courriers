from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

# 1. Tu importes ton ViewSet au lieu de la fonction
from courrier.views import SocieteViewSet, test_connection,PersonnelViewSet,CourrierEntrantViewSet,CourrierSortantViewSet,UtilisateurViewSet

# 2. Tu crées le routeur DRF
router = DefaultRouter()
# On enregistre le ViewSet sous le préfixe 'societes'
router.register(r"societes", SocieteViewSet, basename="societe")
router.register(r"personnels", PersonnelViewSet, basename="personnel")
router.register(r"courriers-entrants", CourrierEntrantViewSet, basename="courrier-entrant")
router.register(r"courriers-sortants", CourrierSortantViewSet, basename="courrier-sortant")
router.register(r"utilisateurs", UtilisateurViewSet, basename="utilisateur")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("courrier/", test_connection), 
    # 3. Tu inclus toutes les routes générées automatiquement par le routeur :
    path("api/", include(router.urls)),
]