import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileSignature, 
  ArrowRightLeft, 
  Search, 
  Filter, 
  ChevronRight,
  ShieldAlert,
  FileText,
  X,
  Send
} from 'lucide-react';

const TACHES_INITIO = [
  {
    id: 1,
    reference: "COUR-2026-091",
    titre: "Visa & Annotation sur la convention de partenariat IT",
    expediteur: "Service Juridique",
    dateLimite: "Aujourd'hui, 17:00",
    priorite: "Haute",
    typeAction: "Annotation & Transmettre",
    statut: "En attente",
    description: "Revue finale du contrat de prestation informatique avant transmission au Ministère pour signature bilatérale.",
    fichier: "Convention_Partenariat_v2.pdf"
  },
  {
    id: 2,
    reference: "COUR-2026-084",
    titre: "Signature de la note de service - Campagne de Stage L3/Master",
    expediteur: "Direction des Ressources Humaines",
    dateLimite: "Demain, 12:00",
    priorite: "Moyenne",
    typeAction: "Signature",
    statut: "En attente",
    description: "Validation officielle du calendrier et du budget alloué aux indemnités de stage 2026-2027.",
    fichier: "Note_Service_Stages.pdf"
  },
  {
    id: 3,
    reference: "COUR-2026-079",
    titre: "Approbation du devis pour le renouvellement du matériel réseau",
    expediteur: "Direction Financière (DAF)",
    dateLimite: "20 Sept 2026",
    priorite: "Urgente",
    typeAction: "Validation Budgétaire",
    statut: "En cours",
    description: "Demande d'accord préalable de la Direction Générale pour l'engagement de la dépense sur les nouveaux serveurs.",
    fichier: "Devis_Serveurs_2026.pdf"
  }
];

export default function TacheDG() {
  const [taches, setTaches] = useState(TACHES_INITIO);
  const [selectedId, setSelectedId] = useState(1);
  const [filtrePriorite, setFiltrePriorite] = useState('Tous');
  const [recherche, setRecherche] = useState('');

  // Modale pour traiter une tâche (Annotation / Transmission)
  const [modalOpen, setModalOpen] = useState(false);
  const [serviceAssigne, setServiceAssigne] = useState('');
  const [instructionText, setInstructionText] = useState('');

  const tacheActive = taches.find((t) => t.id === selectedId);

  // Filtrage
  const tachesFiltrees = taches.filter((t) => {
    const matchSearch = t.titre.toLowerCase().includes(recherche.toLowerCase()) ||
                        t.reference.toLowerCase().includes(recherche.toLowerCase()) ||
                        t.expediteur.toLowerCase().includes(recherche.toLowerCase());
    
    if (filtrePriorite === 'Tous') return matchSearch;
    if (filtrePriorite === 'Urgente') return matchSearch && (t.priorite === 'Urgente' || t.priorite === 'Haute');
    if (filtrePriorite === 'En_attente') return matchSearch && t.statut === 'En attente';
    return matchSearch;
  });

  // Action : Marquer comme Validé / Signé
  const handleSigner = () => {
    setTaches(taches.map(t => 
      t.id === selectedId ? { ...t, statut: 'Terminée / Signée' } : t
    ));
  };

  // Action : Transmettre avec instruction
  const handleTransmettre = () => {
    if (!serviceAssigne) return alert("Veuillez choisir un service.");
    setTaches(taches.map(t => {
      if (t.id === selectedId) {
        return {
          ...t,
          statut: 'Transmise au service',
          description: t.description + `\n\n[Instruction DG -> ${serviceAssigne}] : ${instructionText}`
        };
      }
      return t;
    }));
    setModalOpen(false);
    setInstructionText('');
    setServiceAssigne('');
  };

  return (
    <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* SECTION GAUCHE : LISTE DES TÂCHES DU DG */}
      <div className="w-full md:w-5/12 bg-white border-r border-slate-200 flex flex-col">
        
        {/* En-tête de filtre & Recherche */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Tâches & Directives DG</h2>
            <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              {taches.filter(t => t.statut !== 'Terminée / Signée').length} en attente
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Filtrer par titre, référence..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex gap-1.5 text-[11px] font-medium pt-1">
            <button
              onClick={() => setFiltrePriorite('Tous')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filtrePriorite === 'Tous' ? 'bg-slate-900 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setFiltrePriorite('Urgente')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filtrePriorite === 'Urgente' ? 'bg-red-600 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Urgentes
            </button>
            <button
              onClick={() => setFiltrePriorite('En_attente')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filtrePriorite === 'En_attente' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              À valider
            </button>
          </div>
        </div>

        {/* Liste défilante des tâches */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {tachesFiltrees.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={`p-4 cursor-pointer transition ${
                selectedId === t.id ? 'bg-amber-50/70 border-l-4 border-amber-500' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-mono font-bold text-slate-500">{t.reference}</span>
                <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1">
                  <Clock size={12} /> {t.dateLimite}
                </span>
              </div>

              <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mb-1">{t.titre}</h4>
              <p className="text-[11px] text-slate-500 mb-2.5">De : {t.expediteur}</p>

              <div className="flex items-center justify-between">
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                  t.priorite === 'Urgente' || t.priorite === 'Haute' 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {t.priorite}
                </span>

                <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                  t.statut === 'Terminée / Signée' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : t.statut === 'Transmise au service'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {t.statut}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION DROITE : DÉTAIL & EXÉCUTION DE LA TÂCHE */}
      <div className="w-full md:w-7/12 bg-white flex flex-col justify-between">
        {tacheActive ? (
          <>
            <div>
              {/* Barre supérieure d'actions */}
              <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">{tacheActive.reference}</span>
                  <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
                    {tacheActive.typeAction}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <ArrowRightLeft size={14} /> Instructer / Réorienter
                  </button>
                  <button
                    onClick={handleSigner}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                  >
                    <CheckCircle2 size={14} /> Signer / Valider
                  </button>
                </div>
              </div>

              {/* Fiche détaillée de la tâche */}
              <div className="p-6 space-y-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{tacheActive.titre}</h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>Expéditeur : <strong className="text-slate-800">{tacheActive.expediteur}</strong></span>
                    <span>Échéance : <strong className="text-red-600">{tacheActive.dateLimite}</strong></span>
                  </div>
                </div>

                {/* Bloc d'information */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <p className="text-xs font-bold text-slate-700">Description du besoin :</p>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {tacheActive.description}
                  </p>
                </div>

                {/* Pièce jointe associée */}
                {tacheActive.fichier && (
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl bg-slate-50">
                    <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800">
                      <FileText size={18} className="text-indigo-600" />
                      {tacheActive.fichier}
                    </div>
                    <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline">
                      Ouvrir le document
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Pied de fiche avec rappel de statut */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs">
              <span className="text-slate-400">Statut actuel du dossier :</span>
              <span className="font-bold text-slate-800">{tacheActive.statut}</span>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">Sélectionnez une tâche à traiter.</div>
        )}
      </div>

      {/* MODALE D'INSTRUCTION ET DE RÉORIENTATON */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="text-sm font-bold text-slate-900">Instruction du DG</h4>
              <button onClick={() => setModalOpen(false)}>
                <X size={18} className="text-slate-400 hover:text-slate-600" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Service destinataire</label>
              <select
                value={serviceAssigne}
                onChange={(e) => setServiceAssigne(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Sélectionner un service...</option>
                <option value="Direction Informatique (DSI)">Direction Informatique (DSI)</option>
                <option value="Direction Financière (DAF)">Direction Financière (DAF)</option>
                <option value="Ressources Humaines (DRH)">Ressources Humaines (DRH)</option>
                <option value="Service Juridique">Service Juridique</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Directive / Annotation</label>
              <textarea
                rows="3"
                value={instructionText}
                onChange={(e) => setInstructionText(e.target.value)}
                placeholder="Ex: Merci de vérifier les termes de la clause 4 avant validation définitive..."
                className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-amber-500"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModalOpen(false)} className="px-3 py-1.5 text-xs text-slate-500 font-bold hover:bg-slate-100 rounded-xl">
                Annuler
              </button>
              <button onClick={handleTransmettre} className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 font-bold text-xs text-slate-950 rounded-xl flex items-center gap-1">
                <Send size={12} /> Transmettre la directive
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}