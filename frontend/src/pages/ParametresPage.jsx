import React, { useState } from 'react';
import { 
  Building2, 
  Hash, 
  Bell, 
  ShieldCheck, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Info 
} from 'lucide-react';

const INITIAL_SETTINGS = {
  // Général
  organizationName: 'AIB - Agence Ivoirienne de Bâtiment',
  organizationCode: 'AIB-2026',
  emailContact: 'contact@aib.ci',
  phoneContact: '+225 07 00 00 00 00',

  // Numérotation
  numberingFormat: 'YYYY-XXXX',
  prefixArrivee: 'ARR-',
  prefixDepart: 'DEP-',
  resetCounterYearly: true,

  // Notifications
  alertDelayDays: 3,
  emailNotifications: true,
  smsNotifications: false,

  // Sécurité / Archivage
  autoArchiveMonths: 12,
  requireApprovalForExport: true,
};

function Parametres() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [activeTab, setActiveTab] = useState('general');
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique d'enregistrement (API call)
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setSettings(INITIAL_SETTINGS);
    setIsSaved(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Paramètres système</h1>
          <p className="text-xs text-gray-500 mt-1">
            Configurez les paramètres globaux de gestion et de numérotation des courriers.
          </p>
        </div>

        {/* Message de confirmation d'enregistrement */}
        {isSaved && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium rounded-lg animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Modifications enregistrées !</span>
          </div>
        )}
      </div>

      {/* Barre d'onglets */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'general'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Informations Générales</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('numbering')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'numbering'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>Numérotation & Format</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'notifications'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alertes & Délais</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sécurité & Archivage</span>
        </button>
      </div>

      {/* Formulaire des paramètres */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        
        {/* Onglet 1 : Général */}
        {activeTab === 'general' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Identité de l'Organisation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Nom complet de la Structure
                </label>
                <input
                  type="text"
                  value={settings.organizationName}
                  onChange={(e) => handleChange('organizationName', e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Code / Sigle interne
                </label>
                <input
                  type="text"
                  value={settings.organizationCode}
                  onChange={(e) => handleChange('organizationCode', e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email institutionnel
                </label>
                <input
                  type="email"
                  value={settings.emailContact}
                  onChange={(e) => handleChange('emailContact', e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Téléphone fixe
                </label>
                <input
                  type="text"
                  value={settings.phoneContact}
                  onChange={(e) => handleChange('phoneContact', e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Onglet 2 : Numérotation */}
        {activeTab === 'numbering' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Règles d'Immatriculation des Courriers</h2>
            
            <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-3 flex items-start gap-2.5 text-xs text-blue-800">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <p>
                <strong>Exemple généré :</strong> Le prochain courrier d'arrivée sera codifié sous le format{' '}
                <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-blue-300 font-semibold text-blue-900">
                  {settings.prefixArrivee}2026-0042
                </span>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Format du numéro d'ordre
                </label>
                <select
                  value={settings.numberingFormat}
                  onChange={(e) => handleChange('numberingFormat', e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="YYYY-XXXX">Année + Numéro séquentiel (Ex: 2026-0001)</option>
                  <option value="PREFIX-YYYY-XXXX">Préfixe + Année + Numéro (Ex: ARR-2026-0001)</option>
                  <option value="XXXX-YYYY">Numéro séquentiel + Année (Ex: 0001-2026)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Préfixe Courriers Arrivée
                </label>
                <input
                  type="text"
                  value={settings.prefixArrivee}
                  onChange={(e) => handleChange('prefixArrivee', e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Préfixe Courriers Départ
                </label>
                <input
                  type="text"
                  value={settings.prefixDepart}
                  onChange={(e) => handleChange('prefixDepart', e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <input
                  type="checkbox"
                  id="resetCounterYearly"
                  checked={settings.resetCounterYearly}
                  onChange={(e) => handleChange('resetCounterYearly', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="resetCounterYearly" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Réinitialiser le compteur à 0001 chaque 1er janvier
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Onglet 3 : Alertes */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Gestion des Alertes & Délais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Seuil d'alerte avant retard (Jours)
                </label>
                <input
                  type="number"
                  min="1"
                  max="15"
                  value={settings.alertDelayDays}
                  onChange={(e) => handleChange('alertDelayDays', parseInt(e.target.value) || 1)}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Un rappel sera émis X jours avant l'expiration du délai imparti au courrier.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="emailNotifications" className="text-xs font-semibold text-gray-700 cursor-pointer">
                    Notification par Email en cas d'assignation
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="smsNotifications" className="text-xs font-semibold text-gray-700 cursor-pointer">
                    Alertes SMS pour les courriers confidentiels/urgents
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onglet 4 : Sécurité */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Politique de Sécurité & Archivage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Archivage automatique après (Mois)
                </label>
                <input
                  type="number"
                  value={settings.autoArchiveMonths}
                  onChange={(e) => handleChange('autoArchiveMonths', parseInt(e.target.value) || 12)}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <input
                  type="checkbox"
                  id="requireApprovalForExport"
                  checked={settings.requireApprovalForExport}
                  onChange={(e) => handleChange('requireApprovalForExport', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="requireApprovalForExport" className="text-xs font-semibold text-gray-700 cursor-pointer">
                  Valider par code Administrateur lors de l'exportation Excel/PDF
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Barre d'action inférieure */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Enregistrer la configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default Parametres;