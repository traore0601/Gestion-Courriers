import React, { useState } from 'react';
import { 
  Send, 
  Paperclip, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Building2, 
  User, 
  Mail, 
  Tag, 
  UploadCloud,
  ArrowLeft,
  ShieldAlert,
  Clock,
  Truck,
  Link2,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { authFetch } from '../api/apiClient.js';

const FormulaireSortant = ({ onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errors, setErrors] = useState({});

  // État enrichi du formulaire
  const [formData, setFormData] = useState({
    // Identification & Générales
    reference: `CD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    date_expedition: new Date().toISOString().split('T')[0],
    type_courrier: 'Lettre',
    confidentialite: 'Public',
    priorite: 'Normale',

    // Émetteur (Interne)
    service_emetteur: 'Direction Générale',
    redacteur: '',
    signataire: '',

    // Destinataire (Externe)
    type_destinataire: 'Entreprise',
    structure_destinataire: '',
    nom_destinataire: '',
    email_destinataire: '',
    adresse_postale: '',

    // Contenu & Indexation
    objet: '',
    mots_cles: '',
    description: '',

    // Expédition & Traçabilité
    mode_expedition: 'Livreur / Porteur',
    numero_suivi: '',
    cout_envoi: '',
    accuse_reception: false,

    // Liaison / Maillage
    courrier_entrant_lie: '',
  });

  // Gestion des pièces jointes
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // 1. Enregistrement du courrier sortant
      const response = await authFetch('http://127.0.0.1:8000/api/courriers-sortants/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const dataErrors = await response.json();
        console.error("Détail des erreurs API Courrier Sortant :", dataErrors);
        setErrors(dataErrors);
        return;
      }

      const courrierCree = await response.json();

      // 2. Upload des pièces jointes si des fichiers existent
      if (files.length > 0) {
        for (let file of files) {
          const fileFormData = new FormData();
          fileFormData.append('repertoire_pj', file);
          fileFormData.append('nom_original', file.name);
          fileFormData.append('taille', file.size);
          fileFormData.append('type_mime', file.type || 'application/octet-stream');
          fileFormData.append('courrier_sortant', courrierCree.id);

          await authFetch('http://127.0.0.1:8000/api/pieces-jointes/', {
            method: 'POST',
            body: fileFormData,
          });
        }
      }

      setSuccessMsg(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);

    } catch (err) {
      console.error("Erreur réseau / serveur :", err);
      alert("Erreur réseau : Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 bg-slate-50/50 min-h-screen">
      
      {/* Navigation et Titre */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {onCancel && (
            <button 
              type="button"
              onClick={onCancel}
              className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 transition-colors shadow-xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Enregistrer un Courrier Départ</h1>
            <p className="text-sm text-slate-500">Remplissez les informations ci-dessous pour assurer la traçabilité complète de l'envoi.</p>
          </div>
        </div>
      </div>

      {/* Message de Succès */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium text-sm">Le courrier départ a été enregistré et indexé avec succès !</span>
        </div>
      )}

      {/* Formulaire Principal */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1 : Identification & Classification */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Tag className="w-4 h-4 text-blue-600" />
            Identification & Classification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Référence <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-blue-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {errors.reference && <p className="text-rose-500 text-xs mt-1">{errors.reference[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Date d'expédition <span className="text-rose-500">*</span>
              </label>
              <input 
                type="date"
                name="date_expedition"
                value={formData.date_expedition}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Type de courrier
              </label>
              <select
                name="type_courrier"
                value={formData.type_courrier}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="Lettre">Lettre d'affaires</option>
                <option value="Note d'information">Note d'information</option>
                <option value="Facture / Devis">Facture / Devis</option>
                <option value="Contrat / Convention">Contrat / Convention</option>
                <option value="Convocation">Convocation</option>
                <option value="Circulaire">Circulaire</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confidentialité
              </label>
              <div className="relative">
                <ShieldAlert className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  name="confidentialite"
                  value={formData.confidentialite}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="Public">Public / Standard</option>
                  <option value="Interne">Interne uniquement</option>
                  <option value="Confidentiel">Confidentiel</option>
                  <option value="Très secret">Très secret</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 : Origine Interne (Émetteur) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Émetteur (Origine Interne)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Service / Direction Émettrice <span className="text-rose-500">*</span>
              </label>
              <select
                name="service_emetteur"
                value={formData.service_emetteur}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="Direction Générale">Direction Générale</option>
                <option value="Direction Financière">Direction Financière & Comptable</option>
                <option value="Service Juridique">Service Juridique</option>
                <option value="Ressources Humaines">Ressources Humaines</option>
                <option value="Direction Technique">Direction Technique / IT</option>
                <option value="Commercial & Marketing">Commercial & Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Rédacteur / Agent émetteur
              </label>
              <input 
                type="text"
                name="redacteur"
                placeholder="ex: Jean Marc"
                value={formData.redacteur}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Signataire Autorisé
              </label>
              <input 
                type="text"
                name="signataire"
                placeholder="ex: M. le Directeur Général"
                value={formData.signataire}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 3 : Destinataire Externe */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Destinataire (Cible Externe)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Type de Destinataire
              </label>
              <select
                name="type_destinataire"
                value={formData.type_destinataire}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="Entreprise">Entreprise / Société</option>
                <option value="Administration">Administration / Ministère</option>
                <option value="Particulier">Particulier</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Organisme / Raison Sociale <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  name="structure_destinataire"
                  placeholder="ex: Ministère de l'Économie Numérique"
                  value={formData.structure_destinataire}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                À l'attention de (Personne / Service)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  name="nom_destinataire"
                  placeholder="ex: M. Kouassi, Directeur des Achats"
                  value={formData.nom_destinataire}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Adresse Email (Copie numérique)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="email"
                  name="email_destinataire"
                  placeholder="ex: contact@structure.ci"
                  value={formData.email_destinataire}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Adresse Postale / Géographique
              </label>
              <input 
                type="text"
                name="adresse_postale"
                placeholder="ex: BP 123 Abidjan 01, Plateau"
                value={formData.adresse_postale}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 4 : Objet, Indexation & Liaison */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Objet, Indexation & Maillage
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Objet du courrier <span className="text-rose-500">*</span>
              </label>
              <input 
                type="text"
                name="objet"
                placeholder="ex: Transmission du rapport annuel d'activités 2026"
                value={formData.objet}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              {errors.objet && <p className="text-rose-500 text-xs mt-1">{errors.objet[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Degré de Priorité
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  name="priorite"
                  value={formData.priorite}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="Basse">Basse</option>
                  <option value="Normale">Normale</option>
                  <option value="Haute">Haute (Urgente)</option>
                  <option value="Très urgente">Très urgente</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mots-clés / Tags (Indexation)
              </label>
              <input 
                type="text"
                name="mots_cles"
                placeholder="ex: #contrat, #fournisseur"
                value={formData.mots_cles}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Courrier Entrant Associé (Si c'est une réponse)
              </label>
              <div className="relative">
                <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  name="courrier_entrant_lie"
                  placeholder="Saisissez la référence du courrier entrant (ex: CE-2026-089)"
                  value={formData.courrier_entrant_lie}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Résumé du contenu / Remarques
              </label>
              <textarea
                name="description"
                rows="2"
                placeholder="Remarques complémentaires ou résumé synthétique du document..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 5 : Mode d'Expédition & Traçabilité */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            Expédition & Traçabilité Logistique
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Mode d'expédition
              </label>
              <select
                name="mode_expedition"
                value={formData.mode_expedition}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                <option value="Livreur / Porteur">Livreur / Porteur Interne</option>
                <option value="Voie Postale (DHL, Chronopost)">Voie Postale Express (DHL/UPS/Chronopost)</option>
                <option value="La Poste (Recommandé)">La Poste (Recommandé)</option>
                <option value="Email Officiel">Email Officiel / Voie Numérique</option>
                <option value="Remise en main propre">Remise en main propre</option>
              </select>
            </div>

            {/* Champ conditionnel : Numéro de suivi */}
            {(formData.mode_expedition.includes('Postale') || formData.mode_expedition.includes('Poste') || formData.mode_expedition.includes('Livreur')) && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  N° de Suivi / Bordereau
                </label>
                <input 
                  type="text"
                  name="numero_suivi"
                  placeholder="ex: DH-982347102"
                  value={formData.numero_suivi}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Coût d'affranchissement (FCFA)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="number"
                  name="cout_envoi"
                  placeholder="ex: 5500"
                  value={formData.cout_envoi}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center pt-4">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  name="accuse_reception"
                  checked={formData.accuse_reception}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded-md border-slate-300 focus:ring-blue-500/20"
                />
                <span className="text-sm font-medium text-slate-700">Accusé de Réception (AR) requis</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 6 : Fichier numérisé & Pièces Jointes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-blue-600" />
            Documents numérisés & Pièces Jointes
          </h2>

          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-200 relative group cursor-pointer">
            <input 
              type="file"
              multiple
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-blue-600 mx-auto mb-2 transition-colors" />
            <p className="text-sm font-medium text-slate-700">
              Glissez-déposez la version scannée (PDF) ou cliquez pour parcourir
            </p>
            <p className="text-xs text-slate-400 mt-1">Formats acceptés : PDF, PNG, JPG (Taille max: 10 Mo par fichier)</p>
          </div>

          {files.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fichiers à téléverser ({files.length}) :</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate">{file.name}</span>
                      <span className="text-[10px] text-slate-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="p-1 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Boutons d'Action */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl transition-all cursor-pointer shadow-xs"
            >
              Annuler
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Valider et Enregistrer
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

export default FormulaireSortant;