
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
   
   civilite = models.CharField(max_length = 10)
   nom_prenom = models.CharField(max_length = 150)
   email=models.EmailField(max_length=254)
   mobile=models.CharField(max_length=20)
   type_agent = models.CharField(max_length=100) 
   matricule = models.CharField(max_length = 50,null=True, blank=True)            
   adresse_local = models.CharField(max_length=150)
   observations=models.TextField(blank=True, null=True)  
   message = models.TextField(blank=True, null=True) 
   photo=models.FileField(upload_to="profil/", null=True, blank=True)   
   date_creation = models.DateTimeField(auto_now_add=True)  
   fonction = models.CharField(max_length=150)
   structure = models.ForeignKey('Structure', on_delete=models.SET_NULL, null=True, blank=True,related_name='membres_personnel')

   def __str__(self):
        # CORRIGÉ : self.raison_social n'existait pas ici
        return self.nom_prenom 
   
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

   numero_ordre = models.CharField(max_length=50, unique=True) 
   class Statut(models.TextChoices):
        ARRIVE = "arrive", "Arrivé"
        A_ASSIGNER = "a_assigner", "À assigner"
        TRANSMIS = "transmis", "Transmis"
        EN_COURS = "en_cours", "En cours de traitement"
        EN_ATTENTE = "en_attente", "En attente de précision"
        TRAITE = "traite", "Traité"
        ARCHIVE = "archive", "Archivé"

   statut = models.CharField(
        max_length=20,
        choices=Statut.choices,
        default=Statut.ARRIVE
    )
   date = models.DateField() 
   reference= models.CharField(max_length=200, unique=True) 
   objet=  models.CharField(max_length=255) 
   nom_expediteur = models.CharField(max_length=200)               
   fonction_expediteur = models.CharField(max_length=200)  
   structure_expediteur =  models.CharField(max_length=200) 
   ville_expediteur= models.CharField(max_length=100)
   signataire =  models.CharField(max_length=200) 
   structure_signataire =  models.CharField(max_length=200) 
   date_reponse = models.DateField(null=True, blank=True)
   delai_de_reponse = models.DateField(null=True, blank=True) 
   confidentialite = models.BooleanField(default=False)        
   date_reception = models.DateTimeField(null=True, blank=True) 
   date_creation = models.DateTimeField(auto_now_add=True)
   date_modification= models.DateTimeField(null=True, blank=True)
   debut_travaux=models.DateField(null=True, blank=True)
   fin_travaux=models.DateField(null=True, blank=True)
   societe = models.ForeignKey(Societe, on_delete=models.SET_NULL,null=True,
    blank=True)
   courrier_sortant= models.ForeignKey(CourrierSortant, on_delete=models.SET_NULL, null=True, blank=True)
   personnel = models.ForeignKey(Personnel, on_delete=models.SET_NULL,null=True,
    blank=True)

   def __str__(self):
        return f"Entrant Ref: {self.reference} - {self.objet}"
   
class PlanningTravaux(models.Model):
   
   statut_travaux=models.CharField(max_length=100)
   date_debut_prevue = models.DateTimeField(auto_now=True) 
   date_fin_prevue = models.DateTimeField(auto_now=True)
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
   courrier_sortant= models.ForeignKey(CourrierSortant, on_delete=models.CASCADE, null=True, blank=True)
   courrier_entrant= models.ForeignKey(CourrierEntrant, on_delete=models.CASCADE, null=True, blank=True)

class PieceJointe(models.Model):
   
   numero_pj = models.CharField(max_length=100,null=True, blank=True)
   si_numerisation = models.BooleanField(default=False,null=True, blank=True) 
   repertoire_pj = models.FileField(upload_to="piece/",null=True, blank=True)  
   courrier_entrant = models.ForeignKey(CourrierEntrant, on_delete=models.CASCADE, null=True, blank=True)
   courrier_sortant = models.ForeignKey(CourrierSortant, on_delete=models.CASCADE, null=True, blank=True)

class Ampliateur(models.Model):
   
   date_envoi= models.DateTimeField(auto_now_add=True,null=True, blank=True)
   type_destinataire = models.CharField(max_length=200,null=True, blank=True) 
   courrier_entrant = models.ForeignKey(CourrierEntrant, on_delete=models.CASCADE)
   personnel = models.ForeignKey(Personnel, on_delete=models.CASCADE)
   

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