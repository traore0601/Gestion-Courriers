import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  FileSignature, 
  Users, 
  Key, 
  Save, 
  Upload, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function ParametreDG() {
  const [activeTab, setActiveTab] = useState('profil');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // État du profil DG
  const [profil, setProfil] = useState({
    nom: "Traoré",
    prenom: "Maimouna",
    email: "dg@entreprise.ci",
    telephone: "+225 07 00 00 00 00",
    titre: "Directeur Général",
    signatureUrl: null
  });

  // État de la délégation
  const [delegation, setDelegation] = useState({
    active: false,
    suppleant: "Secrétaire Général",
    dateDebut: "",
    dateFin: "",
    autoriserSignature: false
  });

  // État des notifications
  const [notifs, setNotifs] = useState({
    emailUrgent: true,
    smsAlerte: true,
    rappelEcheance: true,
    resumeQuotidien: false
  });

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* 1. MENU NAVIGATION PARAMÈTRES (GAUCHE) */}
      <div className="w-full md:w-1/4 bg-white border-r border-slate-200 p-4 space-y-1">
        <h2 className="text-sm font-bold text-slate-900 px-3 py-2 mb-2">Paramètres DG</h2>

        <button
          onClick={() => setActiveTab('profil')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'profil' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User size={16} /> Profil & Identité
        </button>

        <button
          onClick={() => setActiveTab('signature')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'signature' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSignature size={16} /> Signature & Cachet
        </button>

        <button
          onClick={() => setActiveTab('delegation')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'delegation' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users size={16} /> Délégation de pouvoir
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'notifications' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bell size={16} /> Notifications & Alertes
        </button>

        <button
          onClick={() => setActiveTab('securite')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'securite' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck size={16} /> Sécurité & Mot de passe
        </button>
      </div>

      {/* 2. CONTENU DU PANNEAU DE CONFIGURATION (DROITE) */}
      <div className="w-full md:w-3/4 bg-white p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Message de confirmation */}
          {savedSuccess && (
            <div className="mb-4 p-3 bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 size={16} /> Les modifications ont été enregistrées avec succès.
            </div>
          )}

          {/* TAB 1 : PROFIL */}
          {activeTab === 'profil' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Informations Générales</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={profil.nom}
                    onChange={(e) => setProfil({ ...profil, nom: e.target.value })}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    value={profil.prenom}
                    onChange={(e) => setProfil({ ...profil, prenom: e.target.value })}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Adresse E-mail</label>
                  <input
                    type="email"
                    value={profil.email}
                    onChange={(e) => setProfil({ ...profil, email: e.target.value })}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="text"
                    value={profil.telephone}
                    onChange={(e) => setProfil({ ...profil, telephone: e.target.value })}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titre Officiel</label>
                <input
                  type="text"
                  value={profil.titre}
                  disabled
                  className="w-full bg-slate-200/60 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-600 font-bold"
                />
              </div>
            </div>
          )}

          {/* TAB 2 : SIGNATURE ÉLECTRONIQUE */}
          {activeTab === 'signature' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Signature & Cachet Officiel</h3>
              <p className="text-xs text-slate-500">
                Téléchargez votre signature numérisée au format PNG (fond transparent) pour valider vos courriers en un clic.
              </p>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2 bg-slate-50">
                <Upload size={24} className="mx-auto text-slate-400" />
                <p className="text-xs font-bold text-slate-700">Glissez-déposez votre fichier de signature ici</p>
                <p className="text-[11px] text-slate-400">Formats acceptés : PNG, SVG (Max. 2 Mo)</p>
                <button className="mt-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl">
                  Parcourir le fichier
                </button>
              </div>
            </div>
          )}

          {/* TAB 3 : DÉLÉGATION */}
          {activeTab === 'delegation' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Délégation de pouvoir</h3>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div>
                  <p className="text-xs font-bold text-slate-800">Activer la délégation automatique</p>
                  <p className="text-[11px] text-slate-500">Permet à un suppléant de consulter et traiter les courriers durant vos absences.</p>
                </div>
                <input
                  type="checkbox"
                  checked={delegation.active}
                  onChange={(e) => setDelegation({ ...delegation, active: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </div>

              {delegation.active && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Désigner le suppléant</label>
                    <select
                      value={delegation.suppleant}
                      onChange={(e) => setDelegation({ ...delegation, suppleant: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs font-medium outline-none"
                    >
                      <option value="Secrétaire Général">Secrétaire Général</option>
                      <option value="Directeur Adjoint">Directeur Général Adjoint (DGA)</option>
                      <option value="Chef de Cabinet">Chef de Cabinet</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Date de début</label>
                      <input
                        type="date"
                        value={delegation.dateDebut}
                        onChange={(e) => setDelegation({ ...delegation, dateDebut: e.target.value })}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 text-xs outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Date de fin</label>
                      <input
                        type="date"
                        value={delegation.dateFin}
                        onChange={(e) => setDelegation({ ...delegation, dateFin: e.target.value })}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4 : NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Alertes & Notifications</h3>

              <div className="flex items-center justify-between p-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">Notification par e-mail pour les courriers urgents</span>
                <input
                  type="checkbox"
                  checked={notifs.emailUrgent}
                  onChange={(e) => setNotifs({ ...notifs, emailUrgent: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">Rappels d'échéances des tâches</span>
                <input
                  type="checkbox"
                  checked={notifs.rappelEcheance}
                  onChange={(e) => setNotifs({ ...notifs, rappelEcheance: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
              </div>
            </div>
          )}

          {/* TAB 5 : SÉCURITÉ */}
          {activeTab === 'securite' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b pb-2">Sécurité du Compte DG</h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mot de passe actuel</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PIED DE BOUTON DE SAUVEGARDE */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition"
          >
            <Save size={14} /> Enregistrer les modifications
          </button>
        </div>
      </div>

    </div>
  );
}