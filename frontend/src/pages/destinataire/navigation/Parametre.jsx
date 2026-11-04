import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Building2, 
  Hash, 
  Bell, 
  ShieldCheck, 
  FileSignature, 
  Save, 
  Upload, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  KeyRound 
} from 'lucide-react';

export default function Parametre() {
  const [activeTab, setActiveTab] = useState('profil');
  const [sauvegardeOk, setSauvegardeOk] = useState(false);

  // État du profil utilisateur & signature
  const [profil, setProfil] = useState({
    nomComplet: "Directeur Général",
    email: "dg@entreprise.ci",
    telephone: "+225 07 00 00 00 00",
    fonction: "Directeur Général",
    signatureUrl: null
  });

  // État de la numérotation des courriers
  const [numeroFormat, setNumeroFormat] = useState({
    prefixeArrivee: "ARR",
    prefixeDepart: "DEP",
    anneeInclude: true,
    separateur: "-",
    compteurCourant: 89
  });

  // Liste des services / directions
  const [services, setServices] = useState([
    { id: 1, code: "DAF", nom: "Direction Administrative et Financière", responsable: "Kouassi Jean" },
    { id: 2, code: "DRH", nom: "Direction des Ressources Humaines", responsable: "Aka Marie" },
    { id: 3, code: "DSI", nom: "Direction des Systèmes d'Information", responsable: "Traoré Oumar" },
    { id: 4, code: "JUR", nom: "Service Juridique & Contentieux", responsable: "Koffi Sarah" }
  ]);

  const [nouveauService, setNouveauService] = useState({ code: '', nom: '', responsable: '' });

  // Notifications
  const [notifs, setNotifs] = useState({
    emailNouveauCourrier: true,
    emailRappelEcheance: true,
    alertesUrgentes: true,
    rapportHebdo: false
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSauvegardeOk(true);
    setTimeout(() => setSauvegardeOk(false), 2500);
  };

  const handleAjouterService = (e) => {
    e.preventDefault();
    if (!nouveauService.code || !nouveauService.nom) return;
    setServices([...services, { ...nouveauService, id: Date.now() }]);
    setNouveauService({ code: '', nom: '', responsable: '' });
  };

  const handleSupprimerService = (id) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-2xl flex flex-col overflow-hidden font-sans">
      
      {/* 1. EN-TÊTE DE LA PAGE PARAMÈTRES */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900 text-amber-400 rounded-xl font-bold shadow-sm">
            <Settings size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Paramètres & Configuration</h2>
            <p className="text-xs text-slate-500">
              Gérez vos préférences, l'organigramme, la numérotation et la sécurité du système.
            </p>
          </div>
        </div>

        {sauvegardeOk && (
          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1.5 animate-fade-in">
            <CheckCircle2 size={16} /> Modifications enregistrées !
          </div>
        )}
      </div>

      {/* 2. NAVIGATION PAR ONGLETS */}
      <div className="bg-white border-b border-slate-200 px-4 flex gap-1 overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('profil')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'profil' 
              ? 'border-amber-500 text-amber-600 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User size={15} /> Profil & Signature
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'services' 
              ? 'border-amber-500 text-amber-600 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 size={15} /> Directions & Services
        </button>

        <button
          onClick={() => setActiveTab('chrono')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'chrono' 
              ? 'border-amber-500 text-amber-600 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Hash size={15} /> Numérotation & Chrono
        </button>

        <button
          onClick={() => setActiveTab('notifs')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'notifs' 
              ? 'border-amber-500 text-amber-600 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell size={15} /> Notifications
        </button>

        <button
          onClick={() => setActiveTab('securite')}
          className={`py-3 px-3.5 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'securite' 
              ? 'border-amber-500 text-amber-600 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck size={15} /> Sécurité & Rôles
        </button>
      </div>

      {/* 3. CONTENU DES ONGLETS */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100/60">
        <form onSubmit={handleSave} className="max-w-4xl mx-auto space-y-5">
          
          {/* --- ONGLET 1: PROFIL & SIGNATURE --- */}
          {activeTab === 'profil' && (
            <div className="space-y-4">
              <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">Informations Personnelles</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom & Prénom / Titre</label>
                    <input
                      type="text"
                      value={profil.nomComplet}
                      onChange={(e) => setProfil({ ...profil, nomComplet: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Adresse Email</label>
                    <input
                      type="email"
                      value={profil.email}
                      onChange={(e) => setProfil({ ...profil, email: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fonction / Post</label>
                    <input
                      type="text"
                      value={profil.fonction}
                      onChange={(e) => setProfil({ ...profil, fonction: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Téléphone</label>
                    <input
                      type="text"
                      value={profil.telephone}
                      onChange={(e) => setProfil({ ...profil, telephone: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION SIGNATURE NUMÉRISÉE */}
              <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-3 shadow-sm">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <FileSignature size={18} className="text-amber-600" />
                  <h3 className="text-xs font-bold text-slate-900">Signature Électronique & Griffe</h3>
                </div>
                <p className="text-[11px] text-slate-500">
                  Importez votre signature scannée (fond transparent PNG recommandé). Elle sera utilisée pour l'annotation automatique des courriers.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <div className="w-48 h-24 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400">
                    {profil.signatureUrl ? (
                      <img src={profil.signatureUrl} alt="Signature" className="max-h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-center px-2">Aucune signature enregistrée</span>
                    )}
                  </div>

                  <label className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2 transition">
                    <Upload size={14} /> Importer une image (.png, .jpg)
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* --- ONGLET 2: DIRECTIONS & SERVICES --- */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              {/* Formulaire ajout rapide */}
              <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-3 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900">Ajouter une nouvelle Direction / Service</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <input
                    type="text"
                    placeholder="Code (ex: DAF, DSI)"
                    value={nouveauService.code}
                    onChange={(e) => setNouveauService({ ...nouveauService, code: e.target.value })}
                    className="bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Intitulé complet du service"
                    value={nouveauService.nom}
                    onChange={(e) => setNouveauService({ ...nouveauService, nom: e.target.value })}
                    className="bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Nom du responsable"
                    value={nouveauService.responsable}
                    onChange={(e) => setNouveauService({ ...nouveauService, responsable: e.target.value })}
                    className="bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAjouterService}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                >
                  <Plus size={15} /> Ajouter le Service
                </button>
              </div>

              {/* Liste des services */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="p-3">Code</th>
                      <th className="p-3">Intitulé de la Direction</th>
                      <th className="p-3">Responsable</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {services.map((srv) => (
                      <tr key={srv.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-amber-600">{srv.code}</td>
                        <td className="p-3 font-medium text-slate-800">{srv.nom}</td>
                        <td className="p-3 text-slate-600">{srv.responsable || "Non assigné"}</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleSupprimerService(srv.id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- ONGLET 3: NUMÉROTATION CHRONO --- */}
          {activeTab === 'chrono' && (
            <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">Format des Références Automatiques</h3>
              
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-mono text-amber-900">
                Aperçu du format généré : <strong>{numeroFormat.prefixeArrivee}{numeroFormat.separateur}{numeroFormat.anneeInclude ? '2026' : ''}{numeroFormat.separateur}00{numeroFormat.compteurCourant}</strong>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Préfixe Courrier Arrivée</label>
                  <input
                    type="text"
                    value={numeroFormat.prefixeArrivee}
                    onChange={(e) => setNumeroFormat({ ...numeroFormat, prefixeArrivee: e.target.value })}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Préfixe Courrier Départ</label>
                  <input
                    type="text"
                    value={numeroFormat.prefixeDepart}
                    onChange={(e) => setNumeroFormat({ ...numeroFormat, prefixeDepart: e.target.value })}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Séparateur</label>
                  <input
                    type="text"
                    value={numeroFormat.separateur}
                    onChange={(e) => setNumeroFormat({ ...numeroFormat, separateur: e.target.value })}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Valeur Actuelle du Compteur</label>
                  <input
                    type="number"
                    value={numeroFormat.compteurCourant}
                    onChange={(e) => setNumeroFormat({ ...numeroFormat, compteurCourant: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* --- ONGLET 4: NOTIFICATIONS --- */}
          {activeTab === 'notifs' && (
            <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4 shadow-sm text-xs">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">Préférences d'Alerte et d'Email</h3>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-800">Notification par Email - Nouveau Courrier</p>
                    <p className="text-[11px] text-slate-500">Recevoir un email chaque fois qu'un courrier vous est attribué.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifs.emailNouveauCourrier}
                    onChange={(e) => setNotifs({ ...notifs, emailNouveauCourrier: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-800">Rappels d'Échéance (24h/48h)</p>
                    <p className="text-[11px] text-slate-500">Recevoir une alerte pour les courriers non traités proches du délai dépassé.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifs.emailRappelEcheance}
                    onChange={(e) => setNotifs({ ...notifs, emailRappelEcheance: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-800">Alertes Priorité Haute & Confidentiel</p>
                    <p className="text-[11px] text-slate-500">Afficher des popups d'alerte immédiate pour les dossiers urgents.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifs.alertesUrgentes}
                    onChange={(e) => setNotifs({ ...notifs, alertesUrgentes: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* --- ONGLET 5: SÉCURITÉ --- */}
          {activeTab === 'securite' && (
            <div className="bg-white p-5 border border-slate-200 rounded-2xl space-y-4 shadow-sm text-xs">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">Sécurité du Compte</h3>
              
              <div className="space-y-3 max-w-md">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mot de passe actuel</label>
                  <input type="password" className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none" />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nouveau mot de passe</label>
                  <input type="password" className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none" />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Confirmer le nouveau mot de passe</label>
                  <input type="password" className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* BOUTON GLOBAL DE SAUVEGARDE */}
          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-md transition"
            >
              <Save size={16} /> Enregistrer les Paramètres
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}