import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileCheck, 
  X, 
  Loader2, 
  Archive,
  MapPin,
  User,
  Building2,
  Inbox,
  Send,
  Save,
  Folder
} from 'lucide-react';

import { authFetch } from './api/apiClient.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export default function UnifiedArchiveForm({ personnels, societes, courriersEntrants, courriersSortants, onSuccess }) {
  const [formData, setFormData] = useState({
    cote_archivage: '',
    intitule_dossier: '',
    numero_dossier: '',
    type_documentaire: '',
    emplacement_physique: '',
    num_boite: '',
    agent: '',
    societe: '',
    courrier_entrant: '',
    courrier_sortant: ''
  });

  const [numeroPj, setNumeroPj] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Soumission unique : Création Archive -> Récupération de l'ID -> Upload de la PJ liée
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert('Veuillez sélectionner un fichier numérisé à joindre.');

    setLoading(true);

    try {
      // Step 1: Enregistrement de l'Archive
      const archivePayload = { ...formData };
      ['agent', 'societe', 'courrier_entrant', 'courrier_sortant'].forEach((key) => {
        if (!archivePayload[key]) archivePayload[key] = null;
      });

      const resArchive = await authFetch(`${API_BASE_URL}/api/archives/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(archivePayload)
      });

      if (!resArchive.ok) {
        const err = await resArchive.json();
        throw new Error(`Erreur création dossier: ${JSON.stringify(err)}`);
      }

      const createdArchive = await resArchive.json();

      // Step 2: Enregistrement de la Pièce Jointe liée à l'Archive créée
      const pjFormData = new FormData();
      pjFormData.append('archive', createdArchive.id); // Clé étrangère liée
      if (numeroPj) pjFormData.append('numero_pj', numeroPj);
      pjFormData.append('repertoire_pj', selectedFile);
      pjFormData.append('nom_original', selectedFile.name);
      pjFormData.append('taille', selectedFile.size);
      pjFormData.append('type_mime', selectedFile.type || 'application/octet-stream');

      const resPj = await authFetch(`${API_BASE_URL}/api/pieces-jointes/`, {
        method: 'POST',
        body: pjFormData
      });

      if (!resPj.ok) {
        throw new Error("Dossier créé mais échec de la liaison avec la pièce jointe.");
      }

      alert("Le dossier d'archive et son document numérisé ont été enregistrés et liés avec succès !");
      
      // Réinitialisation du formulaire
      setFormData({
        cote_archivage: '',
        intitule_dossier: '',
        numero_dossier: '',
        type_documentaire: '',
        emplacement_physique: '',
        num_boite: '',
        agent: '',
        societe: '',
        courrier_entrant: '',
        courrier_sortant: ''
      });
      setNumeroPj('');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error(error);
      alert(error.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
      
      {/* SECTION 1: Informations du Dossier d'Archive */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Archive className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-800">1. Informations du dossier d'archive</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Cote d'archivage <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="cote_archivage"
              required
              value={formData.cote_archivage}
              onChange={handleChange}
              placeholder="Ex: ARC-2026-001"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Intitulé du dossier <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="intitule_dossier"
              required
              value={formData.intitule_dossier}
              onChange={handleChange}
              placeholder="Ex: Contrats Fournisseurs"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Folder className="w-3.5 h-3.5 text-slate-400" /> N° de dossier
            </label>
            <input
              type="text"
              name="numero_dossier"
              value={formData.numero_dossier}
              onChange={handleChange}
              placeholder="Ex: DOS-2026-X"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Type documentaire
            </label>
            <input
              type="text"
              name="type_documentaire"
              value={formData.type_documentaire}
              onChange={handleChange}
              placeholder="Ex: Facture, PV..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Emplacement physique
            </label>
            <input
              type="text"
              name="emplacement_physique"
              value={formData.emplacement_physique}
              onChange={handleChange}
              placeholder="Ex: Salle 2 / Travée C / Boîte 12"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Numéro de Boîte
            </label>
            <input
              type="text"
              name="num_boite"
              value={formData.num_boite}
              onChange={handleChange}
              placeholder="Ex: BOITE-12"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" /> Agent responsable
            </label>
            <select
              name="agent"
              value={formData.agent}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
            >
              <option value="">-- Sélectionner --</option>
              {personnels?.map((p) => (
                <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> Société
            </label>
            <select
              name="societe"
              value={formData.societe}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
            >
              <option value="">-- Sélectionner --</option>
              {societes?.map((s) => (
                <option key={s.id} value={s.id}>{s.nom || s.raison_sociale}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Inbox className="w-3.5 h-3.5 text-slate-400" /> Courrier Entrant
            </label>
            <select
              name="courrier_entrant"
              value={formData.courrier_entrant}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
            >
              <option value="">-- Aucun --</option>
              {courriersEntrants?.map((ce) => (
                <option key={ce.id} value={ce.id}>{ce.numero_enregistrement} - {ce.objet}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Send className="w-3.5 h-3.5 text-slate-400" /> Courrier Sortant
            </label>
            <select
              name="courrier_sortant"
              value={formData.courrier_sortant}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
            >
              <option value="">-- Aucun --</option>
              {courriersSortants?.map((cs) => (
                <option key={cs.id} value={cs.id}>{cs.numero_enregistrement} - {cs.objet}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 2: Pièce Jointe & Numérisation */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800">2. Document scanné rattaché</h2>
          </div>
          <span className="text-[11px] text-rose-500 font-medium">* Fichier obligatoire</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Numéro de Pièce Jointe <span className="text-slate-400 font-normal">(Optionnel)</span>
          </label>
          <input
            type="text"
            value={numeroPj}
            onChange={(e) => setNumeroPj(e.target.value)}
            placeholder="Ex: PJ-2026-001"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:bg-white focus:border-blue-600 focus:outline-none"
          />
        </div>

        {/* Zone de fichier */}
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-slate-50 transition">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            Sélectionner le document scanné
          </button>
          <p className="text-[11px] text-slate-400 mt-1">Formats acceptés : PDF, PNG, JPG</p>

          {selectedFile && (
            <div className="mt-3 inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs text-xs font-semibold text-slate-700">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>{selectedFile.name}</span>
              <button type="button" onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-rose-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bouton de Validation */}
      <div className="flex justify-end pt-3 border-t border-slate-100">
        <button
          type="submit"
          disabled={loading || !selectedFile}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Création et liaison en cours...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Créer le dossier et lier la pièce jointe</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}