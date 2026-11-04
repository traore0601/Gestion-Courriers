import React, { useState, useEffect } from 'react';
import PiecesJointesUpload from './PiecesJointesUpload';
import { authFetch } from '../api/apiClient.js';
import { ArrowLeft, Save } from 'lucide-react';

const OPTIONS_TYPE_COURRIER = [
  { value: 'note_service', label: 'Note de service' },
  { value: 'memorandum', label: 'Mémorandum' },
  { value: 'compte_rendu', label: 'Compte rendu' },
  { value: 'rapport_interne', label: 'Rapport interne' },
  { value: 'convocation', label: 'Convocation interne' },
  { value: 'autre', label: 'Autre' },
];

const OPTIONS_PRIORITE = [
  { value: 'Normale', label: 'Normale' },
  { value: 'Haute', label: 'Haute (Urgente)' },
  { value: 'Basse', label: 'Basse' },
];

const INITIAL_FORM_STATE = {
  reference: '',
  date: '',
  type_courrier: 'note_service',
  priorite: 'Normale',
  objet: '',
  expediteur_service: '',
  expediteur_nom: '',
  destinataire_service: '',
  destinataire_nom: '',
  description: '',
  si_numerisation: false,
  reference_doc: '',
};

function FormulaireInterne({ onCancel, onSuccess }) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      if (name === 'si_numerisation' && !checked) {
        updated.reference_doc = '';
        setFiles([]);
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // 1. Création du courrier interne
      const response = await authFetch('http://127.0.0.1:8000/api/courriers-internes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const dataErrors = await response.json();
        setErrors(dataErrors);
        setIsSubmitting(false);
        return;
      }

      const courrierCree = await response.json();

      // 2. Traitement des pièces jointes si numérisation
      if (formData.si_numerisation && files.length > 0) {
        for (let file of files) {
          const fileFormData = new FormData();
          fileFormData.append('repertoire_pj', file);
          fileFormData.append('nom_original', file.name);
          fileFormData.append('taille', file.size);
          fileFormData.append('type_mime', file.type || 'application/octet-stream');
          fileFormData.append('courrier_interne', courrierCree.id);

          await authFetch('http://127.0.0.1:8000/api/pieces-jointes/', {
            method: 'POST',
            body: fileFormData,
          });
        }
      }

      alert('Courrier interne enregistré avec succès !');
      setFormData(INITIAL_FORM_STATE);
      setFiles([]);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur serveur :", error);
      alert("Erreur réseau : Impossible de joindre le serveur.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white p-6 border border-gray-200 rounded-xl shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b pb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Enregistrement d'un Courrier Interne</h2>
          <p className="text-xs text-gray-500">Note de service, mémorandum ou communication inter-services.</p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à la liste
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          {/* Colonne Gauche */}
          <div className="space-y-2.5">
            <InputField
              id="reference"
              label="Référence Interne :"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              error={errors.reference}
              placeholder="Ex : INT-2026-001"
            />

            <SelectField
              id="type_courrier"
              label="Type de document :"
              name="type_courrier"
              value={formData.type_courrier}
              onChange={handleChange}
              error={errors.type_courrier}
              options={OPTIONS_TYPE_COURRIER}
            />

            <InputField
              id="date"
              label="Date d'émission :"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
            />

            <SelectField
              id="priorite"
              label="Priorité / Urgence :"
              name="priorite"
              value={formData.priorite}
              onChange={handleChange}
              error={errors.priorite}
              options={OPTIONS_PRIORITE}
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
                className="w-full px-2.5 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-xs resize-none"
                placeholder="Objet de la note interne..."
              />
              {errors.objet && <p className="text-red-500 text-[10px] mt-0.5">{errors.objet[0]}</p>}
            </div>
          </div>

          {/* Colonne Droite */}
          <div className="space-y-2.5">
            <InputField
              id="expediteur_service"
              label="Service Émetteur :"
              name="expediteur_service"
              value={formData.expediteur_service}
              onChange={handleChange}
              error={errors.expediteur_service}
              placeholder="Ex : Direction des Ressources Humaines"
            />

            <InputField
              id="expediteur_nom"
              label="Nom du Rédacteur / Émetteur :"
              name="expediteur_nom"
              value={formData.expediteur_nom}
              onChange={handleChange}
              error={errors.expediteur_nom}
            />

            <InputField
              id="destinataire_service"
              label="Service Destinataire :"
              name="destinataire_service"
              value={formData.destinataire_service}
              onChange={handleChange}
              error={errors.destinataire_service}
              placeholder="Ex : Tous les services / Service Informatique"
            />

            <InputField
              id="destinataire_nom"
              label="A l'attention de (Personne spécifique) :"
              name="destinataire_nom"
              value={formData.destinataire_nom}
              onChange={handleChange}
              error={errors.destinataire_nom}
            />

            <ToggleField
              label="Pièces Jointes / Numérisation :"
              name="si_numerisation"
              checked={formData.si_numerisation}
              onChange={handleChange}
              activeBg="bg-green-600"
              error={errors.si_numerisation}
            />

            {formData.si_numerisation && (
              <div className="p-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg space-y-2 transition-all">
                <InputField
                  id="reference_doc"
                  label="Référence du document numérisé :"
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

        <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition"
            >
              Annuler
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer le courrier interne'}
          </button>
        </div>
      </form>
    </div>
  );
}

function InputField({ id, label, type = 'text', name, value, onChange, error, placeholder }) {
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
        placeholder={placeholder}
        className="w-full px-2.5 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-xs transition-all"
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
        className="w-full px-2.5 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 text-xs bg-white cursor-pointer transition-all"
      >
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

export default FormulaireInterne;