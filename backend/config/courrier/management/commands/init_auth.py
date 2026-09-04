"""
Commande d'initialisation de l'authentification.

Crée les profils (rôles) de base ainsi qu'un compte utilisateur de test
pour chaque rôle, afin de pouvoir tester immédiatement la page de connexion.

Utilisation :
    python manage.py init_auth
"""
from django.core.management.base import BaseCommand
from django.db import transaction

from courrier.models import Profil, Utilisateur


ROLES = [
    ("ADMIN", "Administrateur"),
    ("DG", "Directeur"),
    ("SECRETAIRE", "Secrétaire"),
    ("SERVICE", "Service"),
]

# email / mot de passe par défaut pour chaque rôle (à changer en production)
TEST_USERS = [
    {
        "role": "ADMIN",
        "email": "admin@courrier.local",
        "username": "admin",
        "password": "Admin@2026",
        "first_name": "Admin",
        "last_name": "Système",
        "is_staff": True,
        "is_superuser": True,
    },
    {
        "role": "DG",
        "email": "dg@courrier.local",
        "username": "directeur",
        "password": "Direction@2026",
        "first_name": "Directeur",
        "last_name": "Général",
        "is_staff": True,
        "is_superuser": False,
    },
    {
        "role": "SECRETAIRE",
        "email": "secretaire@courrier.local",
        "username": "secretaire",
        "password": "Secretaire@2026",
        "first_name": "Marie-Noelle",
        "last_name": "Ester",
        "is_staff": False,
        "is_superuser": False,
    },
    {
        "role": "SERVICE",
        "email": "service@courrier.local",
        "username": "service",
        "password": "Service@2026",
        "first_name": "Agent",
        "last_name": "Service",
        "is_staff": False,
        "is_superuser": False,
    },
]


class Command(BaseCommand):
    help = "Initialise les rôles (Profils) et crée un utilisateur de test par rôle."

    @transaction.atomic
    def handle(self, *args, **options):
        # 1. Création des profils/rôles
        profils = {}
        for role_code, role_label in ROLES:
            profil, created = Profil.objects.get_or_create(
                role=role_code,
                defaults={"nom": role_label},
            )
            profils[role_code] = profil
            state = "créé" if created else "déjà existant"
            self.stdout.write(self.style.SUCCESS(f"Profil {role_code} : {state}"))

        # 2. Création des utilisateurs de test
        for u in TEST_USERS:
            user, created = Utilisateur.objects.get_or_create(
                email=u["email"],
                defaults={
                    "username": u["username"],
                    "first_name": u["first_name"],
                    "last_name": u["last_name"],
                    "is_staff": u["is_staff"],
                    "is_superuser": u["is_superuser"],
                    "profil": profils[u["role"]],
                },
            )
            if created:
                user.set_password(u["password"])
                user.save()
                self.stdout.write(
                    self.style.SUCCESS(
                        f"Utilisateur créé : {u['email']} / mot de passe : {u['password']} (rôle {u['role']})"
                    )
                )
            else:
                # S'assure que le profil est bien rattaché même si l'utilisateur existait déjà
                if user.profil_id != profils[u["role"]].id:
                    user.profil = profils[u["role"]]
                    user.save(update_fields=["profil"])
                self.stdout.write(self.style.WARNING(f"Utilisateur déjà existant : {u['email']}"))

        self.stdout.write(self.style.SUCCESS("Initialisation terminée."))
