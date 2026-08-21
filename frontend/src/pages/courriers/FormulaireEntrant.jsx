import { useState } from 'react';
import PiecesJointesUpload from './PiecesJointesUpload';

// Options correspondant aux TextChoices de Django
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

const OPTIONS_SERVICES_AGENTS = [
  { value: 'direction_generale', label: 'Direction Générale' },
  { value: 'service_rh', label: 'Ressources Humaines' },
  { value: 'service_comptabilite', label: 'Comptabilité & Finances' },
  { value: 'service_informatique', label: 'Service Informatique' },
  { value: 'service_juridique', label: 'Service Juridique' },
  { value: 'service_logistique', label: 'Moyens Généraux & Logistique' },
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
  const [destinataire, setDestinataire] = useState('');
  const [ampliateurs, setAmpliateurs] = useState([]);
  const [instruction, setInstruction] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setAmpliateurs(selectedOptions);
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

    if (!destinataire) {
      alert("Veuillez sélectionner au moins un destinataire principal.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Enregistrement du courrier entrant
      const payloadCourrier = {
        ...formData,
        destinataire,
        instruction,
        ampliateurs,
        delai_de_reponse: formData.droit_de_reponse ? formData.delai_de_reponse : null,
      };

      const response = await fetch('http://127.0.0.1:8000/api/courriers-entrants/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payloadCourrier),
      });

      if (!response.ok) {
        const dataErrors = await response.json();
        console.error("Détail des erreurs Django REST :", dataErrors);
        setErrors(dataErrors);
        setShowSuiviModal(false);
        return;
      }

      const courrierCree = await response.json();

      // 2. Upload des pièces jointes liées au courrier
      if (formData.si_numerisation && files.length > 0) {
        for (let file of files) {
          const fileFormData = new FormData();
          fileFormData.append('repertoire_pj', file);
          fileFormData.append('nom_original', file.name);
          fileFormData.append('taille', file.size);
          fileFormData.append('type_mime', file.type || 'application/octet-stream');
          fileFormData.append('courrier_entrant', courrierCree.id);

          await fetch('http://127.0.0.1:8000/api/pieces-jointes/', {
            method: 'POST',
            body: fileFormData,
          });
        }
      }

      alert('Courrier et pièces jointes enregistrés avec succès !');
      setFormData(INITIAL_FORM_STATE);
      setFiles([]);
      setDestinataire('');
      setAmpliateurs([]);
      setInstruction('');
      setShowSuiviModal(false);
    } catch (error) {
      console.error("Erreur lors de la communication avec l'API :", error);
      alert("Erreur réseau : Impossible de contacter le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleNextStep} className="p-1 bg-white rounded-xl ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          {/* Colonne Gauche */}
          <div className="space-y-2">
            <InputField
              id="numero_ordre"
              label="Numéro d'ordre :"
              name="numero_ordre"
              value={formData.numero_ordre}
              onChange={handleChange}
              error={errors.numero_ordre}
            />

            <InputField
              id="reference"
              label="Référence :"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              error={errors.reference}
            />

            <SelectField
              id="type_courrier"
              label="Type de courrier :"
              name="type_courrier"
              value={formData.type_courrier}
              onChange={handleChange}
              error={errors.type_courrier}
              options={OPTIONS_TYPE_COURRIER}
            />

            <SelectField
              id="nature_courrier"
              label="Nature du courrier :"
              name="nature_courrier"
              value={formData.nature_courrier}
              onChange={handleChange}
              error={errors.nature_courrier}
              options={OPTIONS_NATURE_COURRIER}
            />

            <InputField
              id="date"
              label="Date du courrier :"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
            />

            <div>
              <label htmlFor="objet" className="block text-[11px] font-bold text-gray-700 mb-1">
                Objet :
              </label>
              <textarea
                id="objet"
                name="objet"
                value={formData.objet}
                onChange={handleChange}
                rows={2}
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs resize-none transition-all"
              />
              {errors.objet && <p className="text-red-500 text-[10px] mt-0.5">{errors.objet[0]}</p>}
            </div>

            <ToggleField
              label="Droit de réponse :"
              name="droit_de_reponse"
              checked={formData.droit_de_reponse}
              onChange={handleChange}
              activeBg="bg-blue-600"
              error={errors.droit_de_reponse}
            />

            {formData.droit_de_reponse && (
              <InputField
                id="delai_de_reponse"
                label="Délai de réponse :"
                type="date"
                name="delai_de_reponse"
                value={formData.delai_de_reponse}
                onChange={handleChange}
                error={errors.delai_de_reponse}
              />
            )}

            <ToggleField
              label="Confidentiel :"
              name="confidentialite"
              checked={formData.confidentialite}
              onChange={handleChange}
              activeBg="bg-red-600"
              error={errors.confidentialite}
            />
          </div>

          {/* Colonne Droite */}
          <div className="space-y-2">
            <InputField
              id="nom_expediteur"
              label="Nom Expéditeur :"
              name="nom_expediteur"
              value={formData.nom_expediteur}
              onChange={handleChange}
              error={errors.nom_expediteur}
            />

            <InputField
              id="fonction_expediteur"
              label="Fonction Expéditeur :"
              name="fonction_expediteur"
              value={formData.fonction_expediteur}
              onChange={handleChange}
              error={errors.fonction_expediteur}
            />

            <InputField
              id="structure_expediteur"
              label="Structure Expéditeur :"
              name="structure_expediteur"
              value={formData.structure_expediteur}
              onChange={handleChange}
              error={errors.structure_expediteur}
            />

            <SelectField
              id="ville_expediteur"
              label="Ville Expéditeur :"
              name="ville_expediteur"
              value={formData.ville_expediteur}
              onChange={handleChange}
              error={errors.ville_expediteur}
              options={OPTIONS_VILLES}
            />

            <InputField
              id="signataire"
              label="Signataire :"
              name="signataire"
              value={formData.signataire}
              onChange={handleChange}
              error={errors.signataire}
            />

            <InputField
              id="structure_signataire"
              label="Structure Signataire :"
              name="structure_signataire"
              value={formData.structure_signataire}
              onChange={handleChange}
              error={errors.structure_signataire}
            />

            <ToggleField
              label="Numérisation :"
              name="si_numerisation"
              checked={formData.si_numerisation}
              onChange={handleChange}
              activeBg="bg-green-600"
              error={errors.si_numerisation}
            />

            {formData.si_numerisation && (
              <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg space-y-2.5 transition-all duration-300">
                <InputField
                  id="reference_doc"
                  label="Référence du document :"
                  name="reference_doc"
                  value={formData.reference_doc}
                  onChange={handleChange}
                  error={errors.reference_doc}
                />

                <PiecesJointesUpload files={files} setFiles={setFiles} />
              </div>
            )}
          </div>
        </div>

        <div className="mt-1 pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            Enregistrer et Suivre
          </button>
        </div>
      </form>

      {/* --- Modale Transmission & Suivi --- */}
      {showSuiviModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-gray-100 space-y-3.5">
            <div className="border-b pb-2.5">
              <h3 className="text-sm font-bold text-gray-800">
                Transmission & Suivi du Courrier
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Sélectionnez le destinataire principal et les services en copie.
              </p>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-3">
              <SelectField
                id="destinataire"
                label="Destinataire Principal (Attribution) :"
                name="destinataire"
                value={destinataire}
                onChange={(e) => setDestinataire(e.target.value)}
                options={OPTIONS_SERVICES_AGENTS}
              />

              <div>
                <label htmlFor="ampliateurs" className="block text-[11px] font-bold text-gray-700 mb-1">
                  Ampliateurs / Copie à (Maintenir Ctrl/Cmd pour sélection multiple) :
                </label>
                <select
                  id="ampliateurs"
                  multiple
                  value={ampliateurs}
                  onChange={handleAmpliateursChange}
                  className="w-full px-2.5 py-1 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500 text-xs bg-white h-24 cursor-pointer"
                >
                  {OPTIONS_SERVICES_AGENTS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="p-1 hover:bg-blue-50">
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-gray-400">
                  {ampliateurs.length} amplateur(s) sélectionné(s)
                </span>
              </div>

              <div>
                <label htmlFor="instruction" className="block text-[11px] font-bold text-gray-700 mb-1">
                  Instruction / Note de transmission :
                </label>
                <textarea
                  id="instruction"
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder="Ex : Pour attribution et traitement urgent..."
                  rows={2}
                  className="w-full px-2.5 py-1.5 border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500 text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowSuiviModal(false)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded transition-colors"
                >
                  Ignorer la transmission
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Valider la transmission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ id, label, type = 'text', name, value, onChange, error }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-bold text-gray-700 mb-0.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-2.5 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs transition-all"
      />
      {error && <p className="text-red-500 text-[10px] mt-0.5">{error[0]}</p>}
    </div>
  );
}

function SelectField({ id, label, name, value, onChange, error, options = [] }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-bold text-gray-700 mb-0.5">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-2.5 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs bg-white cursor-pointer transition-all"
      >
        <option value="">-- Sélectionner --</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-[10px] mt-0.5">{error[0]}</p>}
    </div>
  );
}

function ToggleField({ label, name, checked, onChange, activeBg, error }) {
  return (
    <div className="py-0.5">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold text-gray-700">{label}</span>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className="sr-only"
          />
          <span
            className={`px-2.5 py-0.5 text-xs font-bold rounded transition-colors duration-200 ${
              checked ? `${activeBg} text-white` : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {checked ? 'Oui' : 'Non'}
          </span>
        </label>
      </div>
      {error && <p className="text-red-500 text-[10px] mt-0.5">{error[0]}</p>}
    </div>
  );
}

export default FormulaireEntrant;