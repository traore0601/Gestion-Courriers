import React, { useState } from 'react';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Send, 
  Paperclip, 
  Search, 
  Building2, 
  User, 
  ChevronRight,
  CornerUpLeft,
  Calendar,
  X
} from 'lucide-react';

// Liste initiale des courriers et tâches attribués au collaborateur
const DOSSIERS_COLLABORATEUR = [
  {
    id: 1,
    reference: "REF-2026-089",
    expediteur: "Ministère de la Transition Numérique",
    objet: "Demande de partenariat et financement des projets SI 2026",
    instructionDG: "Pour étude technique et proposition de fiche projet avant vendredi 12h.",
    dateAssignation: "16 Septembre 2026",
    echeance: "18 Septembre 2026 (48h)",
    priorite: "Haute",
    statut: "A_traiter", // 'A_traiter' | 'En_cours' | 'Traite'
    fichierJoint: "courrier_089.pdf"
  },
  {
    id: 2,
    reference: "ARCH-2026-DSI-014",
    expediteur: "Direction Financière (DAF)",
    objet: "Devis de renouvellement des licences logicielles et serveurs",
    instructionDG: "Pour vérification de la conformité des spécifications techniques.",
    dateAssignation: "14 Septembre 2026",
    echeance: "20 Septembre 2026",
    priorite: "Normale",
    statut: "En_cours",
    fichierJoint: "devis_licences_2026.pdf"
  },
  {
    id: 3,
    reference: "REF-2026-072",
    expediteur: "Cabinet d'Expertise Comptable",
    objet: "Rapport préliminaire d'évaluation du patrimoine matériel",
    instructionDG: "Pour information et mise à jour de l'inventaire des équipements.",
    dateAssignation: "10 Septembre 2026",
    echeance: "15 Septembre 2026",
    priorite: "Basse",
    statut: "Traite",
    fichierJoint: "rapport_patrimoine.pdf"
  }
];

export default function EspaceCollaborateurs() {
  const [dossiers, setDossiers] = useState(DOSSIERS_COLLABORATEUR);
  const [filtreStatut, setFiltreStatut] = useState('Tous');
  const [recherche, setRecherche] = useState('');
  const [dossierSelectionne, setDossierSelectionne] = useState(null);

  // État du formulaire de compte-rendu / exécution
  const [reponse, setReponse] = useState({
    compteRendu: '',
    fichiersReponse: []
  });
  const [succesReponse, setSuccesReponse] = useState(false);

  // Filtrage des dossiers
  const dossiersFiltres = dossiers.filter((item) => {
    const matchRecherche = 
      item.objet.toLowerCase().includes(recherche.toLowerCase()) ||
      item.reference.toLowerCase().includes(recherche.toLowerCase()) ||
      item.expediteur.toLowerCase().includes(recherche.toLowerCase());

    if (filtreStatut === 'A_traiter') return matchRecherche && item.statut === 'A_traiter';
    if (filtreStatut === 'En_cours') return matchRecherche && item.statut === 'En_cours';
    if (filtreStatut === 'Traite') return matchRecherche && item.statut === 'Traite';

    return matchRecherche;
  });

  // Changement de statut du dossier
  const changerStatutDossier = (id, nouveauStatut) => {
    setDossiers(dossiers.map(d => d.id === id ? { ...d, statut: nouveauStatut } : d));
    if (dossierSelectionne && dossierSelectionne.id === id) {
      setDossierSelectionne({ ...dossierSelectionne, statut: nouveauStatut });
    }
  };

  // Soumission du compte-rendu de travail
  const handleSoumettreTravail = (e) => {
    e.preventDefault();
    if (!reponse.compteRendu) return alert("Veuillez saisir votre compte-rendu d'exécution.");

    setSuccesReponse(true);
    changerStatutDossier(dossierSelectionne.id, 'Traite');

    setTimeout(() => {
      setSuccesReponse(false);
      setReponse({ compteRendu: '', fichiersReponse: [] });
      setDossierSelectionne(null);
    }, 2500);
  };

  return (
    <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-2xl flex flex-col overflow-hidden font-sans">
      
      {/* 1. EN-TÊTE DE L'ESPACE COLLABORATEUR */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-900 text-amber-400 rounded-xl font-bold shadow-sm">
            <User size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Espace Collaborateur & Agent</h2>
            <p className="text-xs text-slate-500">
              Gestion et suivi des courriers et dossiers transmis par la Direction.
            </p>
          </div>
        </div>

        {/* Badges de synthèse */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-lg flex items-center gap-1">
            <Clock size={13} /> {dossiers.filter(d => d.statut === 'A_traiter').length} à traiter
          </span>
          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg flex items-center gap-1">
            <Clock size={13} /> {dossiers.filter(d => d.statut === 'En_cours').length} en cours
          </span>
        </div>
      </div>

      {/* 2. RECHERCHE ET BARRE DE FILTRES */}
      <div className="p-3 bg-white border-b border-slate-200 flex flex-col md:flex-row gap-2 justify-between items-center text-xs">
        
        {/* Recherche */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un dossier, référence ou expéditeur..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Boutons Filtres Statuts */}
        <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setFiltreStatut('Tous')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              filtreStatut === 'Tous' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tous ({dossiers.length})
          </button>

          <button
            onClick={() => setFiltreStatut('A_traiter')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              filtreStatut === 'A_traiter' ? 'bg-red-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            À Traiter
          </button>

          <button
            onClick={() => setFiltreStatut('En_cours')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              filtreStatut === 'En_cours' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            En Cours
          </button>

          <button
            onClick={() => setFiltreStatut('Traite')}
            className={`px-3 py-1.5 rounded-lg transition font-medium ${
              filtreStatut === 'Traite' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Terminés
          </button>
        </div>
      </div>

      {/* 3. LISTE DES DOSSIERS ATTRIBUÉS */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-100/60 space-y-3">
        {dossiersFiltres.length > 0 ? (
          dossiersFiltres.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-4 shadow-sm transition flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
            >
              {/* Infos principales */}
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-slate-900 text-amber-400 text-[10px] font-mono font-bold rounded">
                    {item.reference}
                  </span>

                  {item.statut === 'A_traiter' && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">
                      À Traiter
                    </span>
                  )}
                  {item.statut === 'En_cours' && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded">
                      En Cours
                    </span>
                  )}
                  {item.statut === 'Traite' && (
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded flex items-center gap-1">
                      <CheckCircle2 size={11} /> Terminé
                    </span>
                  )}

                  {item.priorite === 'Haute' && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded border border-red-200">
                      Urgent
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-900 leading-snug">
                  {item.objet}
                </h3>

                {/* Annotation DG transmise */}
                <div className="p-2 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-950">
                  <span className="font-bold">Instruction DG : </span>
                  {item.instructionDG}
                </div>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                  <span>Expéditeur : <strong>{item.expediteur}</strong></span>
                  <span className="flex items-center gap-1 text-slate-700 font-medium">
                    <Calendar size={13} className="text-slate-400" /> Échéance : {item.echeance}
                  </span>
                </div>
              </div>

              {/* Bouton d'action / Traitement */}
              <div className="flex items-center gap-2 self-end md:self-center">
                {item.statut === 'A_traiter' && (
                  <button
                    onClick={() => changerStatutDossier(item.id, 'En_cours')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition"
                  >
                    Démarrer
                  </button>
                )}

                <button
                  onClick={() => setDossierSelectionne(item)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition"
                >
                  <Send size={14} /> Traiter / Rendre compte
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <Inbox size={36} className="text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-700">Aucun dossier trouvé</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Vous n'avez pas de dossier correspondant à ce filtre actuellement.</p>
          </div>
        )}
      </div>

      {/* 4. MODALE DE SOUMISSION DU TRAVAIL / COMPTE-RENDU COLLABORATEUR */}
      {dossierSelectionne && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 border border-slate-200 shadow-2xl space-y-4 font-sans max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-600 uppercase">{dossierSelectionne.reference}</span>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{dossierSelectionne.objet}</h3>
              </div>
              <button
                onClick={() => setDossierSelectionne(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                <X size={18} />
              </button>
            </div>

            {succesReponse ? (
              <div className="p-6 text-center bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                <CheckCircle2 size={36} className="mx-auto text-emerald-600" />
                <h4 className="text-xs font-bold text-emerald-900">Compte-rendu transmis au Directeur Général !</h4>
                <p className="text-[11px] text-emerald-700">Le statut du dossier a été mis à jour à "Terminé".</p>
              </div>
            ) : (
              <form onSubmit={handleSoumettreTravail} className="space-y-4">
                
                {/* Rappel des consignes DG */}
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-amber-900">Instruction & Consigne de la Direction :</p>
                  <p className="text-amber-800 leading-relaxed">{dossierSelectionne.instructionDG}</p>
                </div>

                {/* Saisie du compte-rendu */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Compte-rendu d'exécution / Réponse <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Saisissez votre rapport de traitement, vos observations ou les actions effectuées..."
                    value={reponse.compteRendu}
                    onChange={(e) => setReponse({ ...reponse, compteRendu: e.target.value })}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                  ></textarea>
                </div>

                {/* Pièce jointe du compte-rendu */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Joindre un document (Fiche technique, Devis, Note PDF)</label>
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 border border-slate-200 w-fit transition">
                    <Paperclip size={15} /> Parcourir les fichiers
                    <input type="file" className="hidden" />
                  </label>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDossierSelectionne(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Annuler
                  </button>
                  
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md"
                  >
                    <Send size={14} /> Transmettre la réponse à la Direction
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}