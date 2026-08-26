
from django.db import models
from django.contrib.auth.models import AbstractUser

class Societe(models.Model):
    statut = models.CharField(max_length=50)
    civilite = models.CharField(max_length=10, null=True, blank=True)
    raison_social = models.CharField(max_length=200)
    sigle = models.CharField(max_length=50, null=True, blank=True)
    adresse_local = models.CharField(max_length=200)
    telephone = models.CharField(max_length=20)
    mobile = models.CharField(max_length=20, null=True, blank=True)
    boite_postale = models.CharField(max_length=50, null=True, blank=True)
    secteur_activite = models.CharField(max_length=150)
    date_creation = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.raison_social



class Personnel(models.Model):
    CIVILITE_CHOICES = [
        ('M.', 'Monsieur'),
        ('Mme', 'Madame'),
        ('Mlle', 'Mademoiselle'),
    ]

    civilite = models.CharField(max_length=10, choices=CIVILITE_CHOICES, default='M.')
    nom_prenom = models.CharField(max_length=150, verbose_name="Nom et Prénom")
    email = models.EmailField(max_length=254, unique=True)
    mobile = models.CharField(max_length=20)
    type_agent = models.CharField(max_length=100)
    matricule = models.CharField(max_length=50, unique=True, blank=True, null=True)
    adresse_local = models.CharField(max_length=150, blank=True, default='')
    observations = models.TextField(blank=True, default='')
    message = models.TextField(blank=True, default='')
    photo = models.ImageField(upload_to="profil/", blank=True, null=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    fonction = models.CharField(max_length=150,blank=True, null=True)
    structure = models.ForeignKey(
        'Structure', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='membres_personnel'
    )

    class Meta:
        verbose_name = "Personnel"
        verbose_name_plural = "Personnels"
        ordering = ['nom_prenom']

    def __str__(self):
        return f"{self.civilite} {self.nom_prenom}"
   
class TypeStructure(models.Model):
   
   type_structure = models.CharField(max_length=200)
   sigle=models.CharField(max_length=50,null=True, blank=True)

   def __str__(self):
        return f"{self.type_structure} ({self.sigle})"

class Structure(models.Model):
   
   nom_structure = models.CharField(max_length=200)
   niveau = models.CharField(max_length=100) 
   societe= models.ForeignKey(Societe, on_delete=models.CASCADE)
   type_structure= models.ForeignKey(TypeStructure, on_delete=models.CASCADE)
   
   responsable = models.ForeignKey(Personnel, on_delete=models.SET_NULL, null=True, blank=True,related_name='structures_dirigees')

   def __str__(self):
        return self.nom_structure



class CourrierSortant(models.Model):
   
   numero_ordre_entrant = models.CharField(max_length=50, unique=True)
   numero_courrier_sortant = models.CharField(max_length=50, unique=True)
   statut = models.CharField(max_length=50)
   date = models.DateTimeField() 
   reference= models.CharField(max_length=200, unique=True) 
   objet=  models.CharField(max_length=255)  
   nom_destination = models.CharField(max_length=200)               
   fonction_destination = models.CharField(max_length=200) 
   structure_destinataire =  models.CharField(max_length=200)  
   ville_destinataire= models.CharField(max_length=100) 
   signataire =  models.CharField(max_length=200)
   structure_signataire =  models.CharField(max_length=200)  
   date_reponse = models.DateTimeField(null=True, blank=True)
   delai_de_reponse = models.DateTimeField(null=True, blank=True)
   confidentialite = models.BooleanField(default=False,null=True, blank=True)                   
   date_envoie = models.DateTimeField() 
   date_creation = models.DateTimeField(auto_now_add=True)
   date_modification= models.DateTimeField(auto_now=True)
   personnel= models.ForeignKey(Personnel, on_delete=models.CASCADE)
   societe= models.ForeignKey(Societe, on_delete=models.CASCADE)

   def __str__(self):
        return f"Sortant Ref: {self.reference} - {self.objet}"

      
   

class CourrierEntrant(models.Model):

    # --- ÉNUMÉRATIONS (CHOICES) ---
    class Statut(models.TextChoices):
        ARRIVE = "arrive", "Arrivé"
        A_ASSIGNER = "a_assigner", "À assigner"
        TRANSMIS = "transmis", "Transmis"
        EN_COURS = "en_cours", "En cours de traitement"
        EN_ATTENTE = "en_attente", "En attente de précision"
        TRAITE = "traite", "Traité"
        ARCHIVE = "archive", "Archivé"

    class Priorite(models.TextChoices):
        NORMALE = "normale", "Normale"
        IMPORTANTE = "importante", "Importante"
        URGENTE = "urgente", "Urgente"
        TRES_URGENTE = "tres_urgente", "Très urgente"

    class TypeCourrier(models.TextChoices):
        LETTRE = "lettre", "Lettre"
        DEMANDE = "demande", "Demande"
        FACTURE = "facture", "Facture"
        INVITATION = "invitation", "Invitation"
        RECLAMATION = "reclamation", "Réclamation"
        NOTE = "note", "Note"
        CONVOCATION = "convocation", "Convocation"
        RAPPORT = "rapport", "Rapport"
        AUTRE = "autre", "Autre"

    class NatureCourrier(models.TextChoices):
        ADMINISTRATIF = "administratif", "Administratif"
        COMMERCIAL = "commercial", "Commercial"
        JURIDIQUE = "juridique", "Juridique"
        FINANCIER = "financier", "Financier"
        AUTRE = "autre", "Autre"

    # --- CHAMPS D'IDENTIFICATION & CLASSIFICATION ---
    numero_ordre = models.CharField(
        max_length=50, unique=True, verbose_name="Numéro d'ordre"
    )
    reference = models.CharField(
        max_length=200, unique=True, verbose_name="Référence interne"
    )
    reference_doc = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        verbose_name="Référence du document",
    )
    objet = models.CharField(max_length=255)

    type_courrier = models.CharField(
        max_length=20,
        choices=TypeCourrier.choices,
        default=TypeCourrier.LETTRE,
        verbose_name="Type de courrier",
    )
    nature_courrier = models.CharField(
        max_length=30,
        choices=NatureCourrier.choices,
        null=True,
        blank=True,
        verbose_name="Nature du courrier",
    )
    priorite = models.CharField(
        max_length=20, choices=Priorite.choices, default=Priorite.NORMALE
    )
    statut = models.CharField(
        max_length=20, choices=Statut.choices, default=Statut.ARRIVE
    )

    # --- EXPÉDITEUR & SIGNATAIRE ---
    nom_expediteur = models.CharField(max_length=200)
    fonction_expediteur = models.CharField(
        max_length=200, null=True, blank=True
    )
    structure_expediteur = models.CharField(
        max_length=200, null=True, blank=True
    )
    ville_expediteur = models.CharField(max_length=100, null=True, blank=True)
    pays_expediteur = models.CharField(
        max_length=100, null=True, blank=True
    )

    signataire = models.CharField(max_length=200, null=True, blank=True)
    structure_signataire = models.CharField(
        max_length=200, null=True, blank=True
    )

    # --- DATES & SUIVI ---
    date = models.DateField(verbose_name="Date du courrier")
    date_reception = models.DateTimeField(null=True, blank=True)
    debut_travaux = models.DateField(null=True, blank=True)
    fin_travaux = models.DateField(null=True, blank=True)

    droit_de_reponse = models.BooleanField(
        default=False, verbose_name="Nécessite un droit de réponse"
    )
    date_reponse = models.DateField(null=True, blank=True)
    delai_de_reponse = models.DateField(null=True, blank=True)

    # --- OPTION & CONFIDENTIALITÉ ---
    confidentialite = models.BooleanField(
        default=False, verbose_name="Courrier confidentiel"
    )
    

    # --- RELATIONS ---
    societe = models.ForeignKey(
        'Societe', on_delete=models.SET_NULL, null=True, blank=True
    )
    courrier_sortant = models.ForeignKey(
        'CourrierSortant', on_delete=models.SET_NULL, null=True, blank=True
    )
    personnel = models.ForeignKey(
        'Personnel', on_delete=models.SET_NULL, null=True, blank=True
    )

    # --- AUDIT & HORODATAGE ---
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Entrant Ref: {self.reference} - {self.objet}"

    @property
    def mention_reponse(self):
        if self.droit_de_reponse:
            return "Ce courrier nécessite une réponse."
        return "Ce courrier ne nécessite pas de réponse."

    @property
    def mention_confidentialite(self):
        return "CONFIDENTIEL" if self.confidentialite else "ORDINAIRE"
   
class PlanningTravaux(models.Model):
   
   statut_travaux=models.CharField(max_length=100)
   date_debut_prevue = models.DateTimeField(null=True, blank=True) 
   date_fin_prevue = models.DateTimeField(null=True, blank=True)
   date_debut_effective = models.DateTimeField(blank=True, null=True) 
   date_fin_effective = models.DateTimeField(blank=True, null=True) 
   si_distanciel_presenciel=models.BooleanField(default=False,null=True, blank=True)
   lieu_seance = models.CharField(max_length=200)               
   observations = models.TextField(null=True, blank=True)  
   remarques = models.TextField(null=True, blank=True) 
   courrier_entrant = models.ForeignKey(CourrierEntrant, on_delete=models.CASCADE)
   personnel= models.ForeignKey(Personnel, on_delete=models.CASCADE)


   
class DocumentFinal(models.Model):
   
   ref_document = models.CharField(max_length=255,null=True, blank=True)
   repertoire_document = models.FileField(upload_to="doc/") 
   date_creation = models.DateTimeField(auto_now_add=True)
   consigne = models.CharField(max_length=200,null=True, blank=True)
   courrier_sortant= models.ForeignKey(CourrierSortant, on_delete=models.CASCADE, null=True, blank=True,related_name='documents_finaux')
   courrier_entrant= models.ForeignKey(CourrierEntrant, on_delete=models.CASCADE, null=True, blank=True,related_name='documents_finaux')

class PieceJointe(models.Model):
   
   numero_pj = models.CharField(max_length=100,null=True, blank=True)
   si_numerisation = models.BooleanField(default=False,null=True, blank=True) 
   repertoire_pj = models.FileField(upload_to="piece/",null=True, blank=True)  
   courrier_entrant = models.ForeignKey(CourrierEntrant, on_delete=models.CASCADE, null=True, blank=True,related_name='pieces_jointes')
   courrier_sortant = models.ForeignKey(CourrierSortant, on_delete=models.CASCADE, null=True, blank=True,related_name='pieces_jointes')
   
   nom_original = models.CharField(max_length=255)
   taille = models.BigIntegerField()
   type_mime = models.CharField(max_length=100, blank=True)
   date_ajout = models.DateTimeField(auto_now_add=True, null=True)

   def __str__(self):
        return self.nom_original

from django.db import models

class Ampliateur(models.Model):
    date_envoi = models.DateTimeField(auto_now_add=True)
    type_destinataire = models.CharField(max_length=200, blank=True, default='')
    courrier_entrant = models.ForeignKey(
        CourrierEntrant, 
        on_delete=models.CASCADE,
        related_name='ampliateurs'
    )
    personnel = models.ForeignKey(
        Personnel, 
        on_delete=models.CASCADE,
        related_name='ampliations'
    )

    class Meta:
        verbose_name = "Ampliateur"
        verbose_name_plural = "Ampliateurs"
        # Optionnel : évite d'ajouter deux fois le même personnel pour un même courrier
        unique_together = ('courrier_entrant', 'personnel')

    def __str__(self):
        return f"{self.personnel} - {self.courrier_entrant}"
   

class Profil(models.Model):
    class Role(models.TextChoices):
        SECRETAIRE = "SECRETAIRE", "Secrétaire"
        SERVICE = "SERVICE", "Service"
        ADMIN = "ADMIN", "Administrateur"
        DG = "DG", "Directeur"

    nom = models.CharField(max_length=200)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.SERVICE
    )
    def __str__(self):
        return f"{self.nom} ({self.get_role_display()})"

class Utilisateur(AbstractUser):
    email = models.EmailField(unique=True)
    date_modification = models.DateTimeField(auto_now=True)
    personnel = models.ForeignKey(
        Personnel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="utilisateurs",
    )
    profil = models.ForeignKey(
        Profil, on_delete=models.SET_NULL, null=True, blank=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        role_str = self.profil.role if self.profil else "Sans rôle"
        return f"{self.email} - {role_str}"
    

   
   
class PageMenu(models.Model):
   nom=models.CharField(max_length=200) 
   lien_url=models.CharField(max_length=200) 
   def __str__(self):
        return self.nom
   
class Permission(models.Model):
   pagemenu = models.ForeignKey(PageMenu, on_delete=models.CASCADE)
   profil = models.ForeignKey(Profil, on_delete=models.CASCADE)
   
   def __str__(self):
        return f"{self.profil.nom} -> {self.pagemenu.nom}"