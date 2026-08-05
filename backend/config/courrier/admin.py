from django.contrib import admin

from .models import Societe, CourrierEntrant, CourrierSortant, Personnel, Ampliateur, PieceJointe,PlanningTravaux, TypeStructure, Structure,DocumentFinal,Utilisateur,Profil,Permission,PageMenu


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
admin.site.register(Utilisateur)
admin.site.register(Profil)
admin.site.register(PageMenu)
admin.site.register(Permission)


