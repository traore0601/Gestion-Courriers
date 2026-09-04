from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Societe, CourrierEntrant, CourrierSortant, Personnel, Ampliateur, PieceJointe,PlanningTravaux, TypeStructure, Structure,DocumentFinal,Utilisateur,Profil,Permission,PageMenu


class UtilisateurAdmin(UserAdmin):
    """
    Admin dédié à Utilisateur : réutilise les formulaires natifs de Django
    (UserCreationForm / UserChangeForm) qui hashent correctement le mot de passe,
    au lieu de l'enregistrer en clair comme le ferait un ModelAdmin générique.
    """
    model = Utilisateur
    ordering = ("email",)
    list_display = ("email", "username", "first_name", "last_name", "profil", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active", "profil")
    search_fields = ("email", "username", "first_name", "last_name")

    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        ("Informations personnelles", {"fields": ("first_name", "last_name", "personnel")}),
        ("Rôle et permissions", {
            "fields": ("profil", "is_active", "is_staff", "is_superuser", "groups", "user_permissions"),
        }),
        ("Dates importantes", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "email", "profil", "password1", "password2", "is_staff", "is_active"),
        }),
    )


admin.site.register(CourrierEntrant)
admin.site.register(Societe)
admin.site.register(CourrierSortant)
admin.site.register(Personnel)
admin.site.register(Ampliateur)
admin.site.register(PieceJointe)
admin.site.register(PlanningTravaux)
admin.site.register(TypeStructure)
admin.site.register(Structure)
admin.site.register(DocumentFinal)
admin.site.register(Utilisateur, UtilisateurAdmin)
admin.site.register(Profil)
admin.site.register(PageMenu)
admin.site.register(Permission)



