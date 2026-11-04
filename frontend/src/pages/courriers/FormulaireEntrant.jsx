import { useState, useEffect } from 'react';
import PiecesJointesUpload from './PiecesJointesUpload';
import { authFetch } from '../api/apiClient.js';

// --- OPTIONS ---
const OPTIONS_TYPE_COURRIER = [
  { value: 'lettre', label: 'Lettre' },
  { value: 'demande', label: 'Demande' },
  { value: 'facture', label: 'Facture' },
  { value: 'invitation', label: 'Invitation' },
  { value: 'reclamation', label: 'Réclamation' },
  { value: 'note', label: 'Note' },
  { value: 'convocation', label: 'Convocation' },
  { value: 'rapport', label: 'Rapport' },
  { value: 'autre', label: 'Autre' },
];

const OPTIONS_NATURE_COURRIER = [
  { value: 'administratif', label: 'Administratif' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'juridique', label: 'Juridique' },
  { value: 'financier', label: 'Financier' },
  { value: 'autre', label: 'Autre' },
];

const OPTIONS_VILLES = [
  { value: 'Abidjan', label: 'Abidjan' },
  { value: 'Bouake', label: 'Bouaké' },
  { value: 'Yamoussoukro', label: 'Yamoussoukro' },
  { value: 'San-Pedro', label: 'San-Pédro' },
  { value: 'Korhogo', label: 'Korhogo' },
  { value: 'Daloa', label: 'Daloa' },
  { value: 'autre', label: 'Autre' },
];

const INITIAL_FORM_STATE = {
  confidentialite: false,
  droit_de_reponse: false,
  si_numerisation: false,
  numero_ordre: '',
  reference: '',
  date: '',
  objet: '',
  nom_expediteur: '',
  fonction_expediteur: '',
  structure_expediteur: '',
  ville_expediteur: '',
  signataire: '',
  structure_signataire: '',
  delai_de_reponse: '',
  type_courrier: '',
  nature_courrier: '',
  reference_doc: '',
};

function FormulaireEntrant() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});

  const [showSuiviModal, setShowSuiviModal] = useState(false);
  const [personnel, setPersonnel] = useState('');
  const [ampliateursIds, setAmpliateursIds] = useState([]);
  const [personnelOptions, setPersonnelOptions] = useState([]);
  const [instruction, setInstruction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPersonnels = async () => {
      try {
        const response = await authFetch('http://127.0.0.1:8000/api/personnels/');
        if (response.ok) {
          const data = await response.json();
          const options = data.map((p) => ({
            value: p.id,
            label: `${p.nom_prenom} (${p.fonction || 'Sans fonction'})`,
          }));
          setPersonnelOptions(options);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des personnels :', err);
      }
    };
    fetchPersonnels();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      if (name === 'droit_de_reponse' && !checked) {
        updated.delai_de_reponse = '';
      }

      if (name === 'si_numerisation' && !checked) {
        updated.reference_doc = '';
        setFiles([]);
      }

      return updated;
    });
  };

  const handleAmpliateursChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => Number(option.value));
    setAmpliateursIds(selectedOptions);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.numero_ordre) {
      setErrors({ numero_ordre: ["Le numéro d'ordre est obligatoire."] });
      return;
    }

    setShowSuiviModal(true);
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();

    if (!personnel) {
      alert("Veuillez sélectionner au moins un destinataire principal.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payloadCourrier = {
        ...formData,
        personnel: Number(personnel),
        instruction,
        ampliateurs_ids: ampliateursIds,
        delai_de_reponse: formData.droit_de_reponse ? formData.delai_de_reponse : null,
      };

      const response = await authFetch('http://127.0.0.1:8000/api/courriers-entrants/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadCourrier),
      });

      if (!response.ok) {
        const dataErrors = await response.json();
        setErrors(dataErrors);
        setShowSuiviModal(false);
        return;
      }

      const courrierCree = await response.json();

      if (formData.si_numerisation && files.length > 0) {
        for (let file of files) {
          const fileFormData = new FormData();
          fileFormData.append('repertoire_pj', file);
          fileFormData.append('nom_original', file.name);
          fileFormData.append('taille', file.size);
          fileFormData.append('type_mime', file.type || 'application/octet-stream');
          fileFormData.append('courrier_entrant', courrierCree.id);

          await authFetch('http://127.0.0.1:8000/api/pieces-jointes/', {
            method: 'POST',
            body: fileFormData,
          });
        }
      }

      alert('Courrier et pièces jointes enregistrés avec succès !');
      setFormData(INITIAL_FORM_STATE);
      setFiles([]);
      setPersonnel('');
      setAmpliateursIds([]);
      setInstruction('');
      setShowSuiviModal(false);
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur réseau : Impossible de contacter le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-slate-50 min-h-screen">
      {/* En-tête de la page */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Nouveau Courrier Entrant</h1>
          <p className="text-xs text-slate-500 mt-0.5">Saisissez les détails du courrier et configurez les règles de suivi.</p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          Enregistrement
        </span>
      </div>

      <form onSubmit={handleNextStep} className="space-y-6">
        {/* Alignement vertical (1 puis 2) */}
        <div className="flex flex-col gap-6">

          {/* Section 1 : Informations sur le Courrier */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-sm font-bold text-slate-800">Détails du Courrier</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <InputField
                id="numero_ordre"
                label="N° d'ordre *"
                placeholder="Ex: 2026-001"
                name="numero_ordre"
                value={formData.numero_ordre}
                onChange={handleChange}
                error={errors.numero_ordre}
              />

              <InputField
                id="reference"
                label="Référence du courrier"
                placeholder="Ex: REF-992/DG"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                error={errors.reference}
              />

              <SelectField
                id="type_courrier"
                label="Type de courrier"
                name="type_courrier"
                value={formData.type_courrier}
                onChange={handleChange}
                error={errors.type_courrier}
                options={OPTIONS_TYPE_COURRIER}
              />

              <SelectField
                id="nature_courrier"
                label="Nature du courrier"
                name="nature_courrier"
                value={formData.nature_courrier}
                onChange={handleChange}
                error={errors.nature_courrier}
                options={OPTIONS_NATURE_COURRIER}
              />

              <div className="sm:col-span-2">
                <InputField
                  id="date"
                  label="Date de réception"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  error={errors.date}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="objet" className="block text-xs font-semibold text-slate-700 mb-1">
                  Objet du courrier
                </label>
                <textarea
                  id="objet"
                  name="objet"
                  value={formData.objet}
                  onChange={handleChange}
                  placeholder="Résumé du contenu..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all outline-none resize-none"
                />
                {errors.objet && <p className="text-rose-500 text-[11px] mt-1">{errors.objet[0]}</p>}
              </div>
            </div>
          </div>

          {/* Section 2 : Expéditeur & Signataire (placé en dessous de 1) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-sm font-bold text-slate-800">Expéditeur & Origine</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <InputField
                id="nom_expediteur"
                label="Nom de l'expéditeur"
                placeholder="Nom complet"
                name="nom_expediteur"
                value={formData.nom_expediteur}
                onChange={handleChange}
                error={errors.nom_expediteur}
              />

              <InputField
                id="fonction_expediteur"
                label="Fonction"
                placeholder="Ex: Directeur Général"
                name="fonction_expediteur"
                value={formData.fonction_expediteur}
                onChange={handleChange}
                error={errors.fonction_expediteur}
              />

              <InputField
                id="structure_expediteur"
                label="Structure / Entreprise"
                placeholder="Nom du ministère ou entreprise"
                name="structure_expediteur"
                value={formData.structure_expediteur}
                onChange={handleChange}
                error={errors.structure_expediteur}
              />

              <SelectField
                id="ville_expediteur"
                label="Ville de provenance"
                name="ville_expediteur"
                value={formData.ville_expediteur}
                onChange={handleChange}
                error={errors.ville_expediteur}
                options={OPTIONS_VILLES}
              />

              <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Informations Signataire</p>
              </div>

              <InputField
                id="signataire"
                label="Signataire"
                placeholder="Nom du signataire"
                name="signataire"
                value={formData.signataire}
                onChange={handleChange}
                error={errors.signataire}
              />

              <InputField
                id="structure_signataire"
                label="Structure du signataire"
                placeholder="Structure rattachée"
                name="structure_signataire"
                value={formData.structure_signataire}
                onChange={handleChange}
                error={errors.structure_signataire}
              />
            </div>
          </div>
        </div>

        {/* Section 3 : Options & Numérisation */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h2 className="text-sm font-bold text-slate-800">Options & Fichiers Jointes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Toggle Confidentialité */}
            <ToggleCard
              title="Courrier Confidentiel"
              description="Restreindre la visibilité aux seuls destinataires"
              name="confidentialite"
              checked={formData.confidentialite}
              onChange={handleChange}
              color="rose"
            />

            {/* Toggle Droit de réponse */}
            <ToggleCard
              title="Droit de réponse"
              description="Affiche un délai limite pour traiter la réponse"
              name="droit_de_reponse"
              checked={formData.droit_de_reponse}
              onChange={handleChange}
              color="blue"
            />

            {/* Toggle Numérisation */}
            <ToggleCard
              title="Pièces numérisées"
              description="Joindre les documents scannés ou fichiers PDF"
              name="si_numerisation"
              checked={formData.si_numerisation}
              onChange={handleChange}
              color="emerald"
            />
          </div>

          {/* Champs conditionnels */}
          {(formData.droit_de_reponse || formData.si_numerisation) && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 transition-all">
              {formData.droit_de_reponse && (
                <div className="max-w-xs">
                  <InputField
                    id="delai_de_reponse"
                    label="Date limite de réponse"
                    type="date"
                    name="delai_de_reponse"
                    value={formData.delai_de_reponse}
                    onChange={handleChange}
                    error={errors.delai_de_reponse}
                  />
                </div>
              )}

              {formData.si_numerisation && (
                <div className="space-y-3 pt-2">
                  <div className="max-w-md">
                    <InputField
                      id="reference_doc"
                      label="Référence du document numérisé"
                      placeholder="Ex: SCAN-2026-X"
                      name="reference_doc"
                      value={formData.reference_doc}
                      onChange={handleChange}
                      error={errors.reference_doc}
                    />
                  </div>
                  <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-white">
                    <PiecesJointesUpload files={files} setFiles={setFiles} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bouton de Validation Principal */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
          >
            Suivant : Transmettre & Suivre
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>

      {/* --- Modale Transmission & Suivi --- */}
      {showSuiviModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Transmission & Attribution
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choisissez à qui transmettre ce courrier dans le système.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSuiviModal(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <SelectField
                id="personnel"
                label="Destinataire Principal *"
                name="personnel"
                value={personnel}
                onChange={(e) => setPersonnel(e.target.value)}
                options={personnelOptions}
              />

              <div>
                <label htmlFor="ampliateurs" className="block text-xs font-semibold text-slate-700 mb-1">
                  Ampliateurs / Personnes en copie
                </label>
                <select
                  id="ampliateurs"
                  multiple
                  value={ampliateursIds}
                  onChange={handleAmpliateursChange}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs bg-white h-28 cursor-pointer"
                >
                  {personnelOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="p-1.5 hover:bg-slate-100 rounded">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  💡 Maintenez <strong>Ctrl</strong> (ou <strong>Cmd</strong> sur Mac) pour sélectionner plusieurs membres.
                </span>
              </div>

              <div>
                <label htmlFor="instruction" className="block text-xs font-semibold text-slate-700 mb-1">
                  Instruction / Note de transmission
                </label>
                <textarea
                  id="instruction"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Ex : Pour traitement urgent et retour d'information..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSuiviModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Valider & Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SOUS-COMPOSANTS RÉUTILISABLES ---

function InputField({ id, label, type = 'text', placeholder, name, value, onChange, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs transition-all outline-none"
      />
      {error && <p className="text-rose-500 text-[10px] mt-0.5 font-medium">{error[0]}</p>}
    </div>
  );
}

function SelectField({ id, label, name, value, onChange, error, options = [] }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-xs bg-white cursor-pointer transition-all outline-none"
      >
        <option value="">-- Sélectionner --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-rose-500 text-[10px] mt-0.5 font-medium">{error[0]}</p>}
    </div>
  );
}

function ToggleCard({ title, description, name, checked, onChange, color = 'blue' }) {
  const bgColors = {
    blue: 'peer-checked:bg-blue-600',
    rose: 'peer-checked:bg-rose-600',
    emerald: 'peer-checked:bg-emerald-600',
  };

  return (
    <label className="flex items-start justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/80 transition-all select-none">
      <div className="pr-2">
        <span className="block text-xs font-bold text-slate-800">{title}</span>
        <span className="block text-[11px] text-slate-500 mt-0.5 leading-snug">{description}</span>
      </div>
      <div className="relative inline-flex items-center cursor-pointer mt-0.5">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className={`w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer ${bgColors[color]} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all`} />
      </div>
    </label>
  );
}

export default FormulaireEntrant;