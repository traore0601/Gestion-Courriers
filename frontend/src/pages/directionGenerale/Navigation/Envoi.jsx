import React, { useState } from 'react';
import { 
  CornerUpLeft, 
  Send, 
  FileText, 
  CheckSquare, 
  ShieldAlert, 
  Clock, 
  Building2, 
  Paperclip, 
  FileSignature, 
  CheckCircle2,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

export default function EnvoiDG() {
  // Courrier simulé sélectionné pour traitement par le DG
  const courrierSelectionne = {
    id: 1,
    reference: "REF-2026-089",
    expediteur: "Ministère de la Transition Numérique",
    objet: "Demande de partenariat et financement des projets SI 2026",
    dateReception: "16 Septembre 2026",
    urgent: true,
    confidentiel: false,
    fichierPdfUrl: "courrier_089.pdf"
  };

  // Type d'action/retour du DG
  const [actionType, setActionType] = useState('transmettre'); // 'transmettre' | 'rejeter' | 'traiter_direct'

  // État du formulaire d'instruction DG
  const [instruction, setInstruction] = useState({
    servicesAssignes: ["Direction SI (DSI)"],
    orientation: "Pour attribution et suivi d'exécution",
    noteParticuliere: "",
    delaiTraitement: "48h",
    apposerSignature: true,
    prioriteHaute: true
  });

  const [envoye, setEnvoye] = useState(false);

  // Liste des orientations types pour le DG
  const ORIENTATIONS = [
    "Pour attribution et suivi d'exécution",
    "Pour examen et proposition de réponse",
    "Pour étude financière et devis (DAF)",
    "Pour avis juridique avant signature",
    "Pour classement / Information sans suite"
  ];

  // Liste des services
  const SERVICES = [
    "Direction Financière (DAF)",
    "Ressources Humaines (DRH)",
    "Direction SI (DSI)",
    "Service Juridique & Contentieux",
    "Secrétariat Général"
  ];

  const handleToggleService = (srv) => {
    if (instruction.servicesAssignes.includes(srv)) {
      setInstruction({
        ...instruction,
        servicesAssignes: instruction.servicesAssignes.filter((s) => s !== srv)
      });
    } else {
      setInstruction({
        ...instruction,
        servicesAssignes: [...instruction.servicesAssignes, srv]
      });
    }
  };

  const handleValiderRetour = (e) => {
    e.preventDefault();
    setEnvoye(true);
    setTimeout(() => {
      setEnvoye(false);
      alert("L'annotation et l'instruction ont été enregistrées et transmises aux services.");
    }, 2500);
  };

  return (
    <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-2xl flex flex-col overflow-hidden font-sans">
      
      {/* 1. EN-TÊTE : RETOUR & ANNOTATION DG */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold shadow-sm">
            <CornerUpLeft size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Annotation & Orientation du Courrier</h2>
            <p className="text-xs text-slate-500">
              Traitement DG du courrier réf: <span className="font-mono font-bold text-slate-700">{courrierSelectionne.reference}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {courrierSelectionne.urgent && (
            <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg flex items-center gap-1">
              <AlertTriangle size={13} /> Traitement Urgent
            </span>
          )}
        </div>
      </div>

      {/* 2. CONTENU PRINCIPAL : RAPPEL DU COURRIER (GAUCHE) + INSTRUCTION DG (DROITE) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-100/60">
        
        {envoye ? (
          <div className="p-8 text-center bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3 max-w-xl mx-auto my-12">
            <CheckCircle2 size={44} className="mx-auto text-emerald-600" />
            <h3 className="text-sm font-bold text-emerald-900">Instruction transmise avec succès !</h3>
            <p className="text-xs text-emerald-700">
              Le courrier a été annoté et orienté vers : <strong>{instruction.servicesAssignes.join(', ')}</strong>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-6xl mx-auto">
            
            {/* PANNEAU GAUCHE : RÉSUMÉ DU COURRIER D'ORIGINE (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-4 border border-slate-200 rounded-2xl space-y-3 shadow-sm h-fit">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-center">
                <span className="text-[10px] font-mono font-bold bg-slate-900 text-amber-400 px-2 py-0.5 rounded">
                  {courrierSelectionne.reference}
                </span>
                <span className="text-[11px] text-slate-400">{courrierSelectionne.dateReception}</span>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expéditeur</label>
                <p className="text-xs font-bold text-slate-800">{courrierSelectionne.expediteur}</p>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Objet du courrier</label>
                <p className="text-xs font-semibold text-slate-700 leading-snug">{courrierSelectionne.objet}</p>
              </div>

              {/* Aperçu rapide du document PDF */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-amber-600" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">Courrier_Scanne.pdf</p>
                    <p className="text-[10px] text-slate-400">PDF Numérisé • 1.4 Mo</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert("Ouverture de l'aperçu du PDF...")}
                  className="px-2.5 py-1 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800"
                >
                  Voir PDF
                </button>
              </div>
            </div>

            {/* PANNEAU DROITE : FORMULAIRE D'INSTRUCTION ET RECTIFICATION DG (7 Cols) */}
            <form onSubmit={handleValiderRetour} className="lg:col-span-7 bg-white p-5 border border-slate-200 rounded-2xl space-y-4 shadow-sm">
              
              {/* TYPE D'ARBITRAGE DG */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Décision / Orientation Générale</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setActionType('transmettre')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition ${
                      actionType === 'transmettre' 
                        ? 'bg-amber-500 text-slate-950 border-amber-500' 
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Transmettre / Orienter
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionType('traiter_direct')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition ${
                      actionType === 'traiter_direct' 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Réponse Directe
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionType('rejeter')}
                    className={`p-2.5 rounded-xl border font-bold text-center transition ${
                      actionType === 'rejeter' 
                        ? 'bg-red-600 text-white border-red-600' 
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Rejeter / Classer
                  </button>
                </div>
              </div>

              {/* SERVICE(S) DESTINATAIRE(S) */}
              {actionType === 'transmettre' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Attribuer aux Direction(s) exécutante(s) <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {SERVICES.map((srv) => {
                        const selected = instruction.servicesAssignes.includes(srv);
                        return (
                          <div
                            key={srv}
                            onClick={() => handleToggleService(srv)}
                            className={`p-2 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                              selected ? 'bg-amber-50 border-amber-400 font-bold text-amber-950' : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <Building2 size={14} className={selected ? 'text-amber-600' : 'text-slate-400'} />
                              {srv}
                            </span>
                            <input type="checkbox" checked={selected} readOnly className="accent-amber-500" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* INSTRUCTION PRÉDÉFINIE */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Consigne Type</label>
                    <select
                      value={instruction.orientation}
                      onChange={(e) => setInstruction({ ...instruction, orientation: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold outline-none cursor-pointer"
                    >
                      {ORIENTATIONS.map((ori, i) => (
                        <option key={i} value={ori}>{ori}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* ANNOTATION MANUSCRITE / TEXTE LIBRE DG */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note d'Instruction Manuscrite du DG <span className="text-slate-400 font-normal">(Visible par les directions)</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="Ex: Merci de préparer une note explicative pour la réunion de lundi avant 12h..."
                  value={instruction.noteParticuliere}
                  onChange={(e) => setInstruction({ ...instruction, noteParticuliere: e.target.value })}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                ></textarea>
              </div>

              {/* DELAI & OPTIONS */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Délai d'exécution</label>
                  <select
                    value={instruction.delaiTraitement}
                    onChange={(e) => setInstruction({ ...instruction, delaiTraitement: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-1.5 font-medium outline-none"
                  >
                    <option value="24h">24 Heures (Urgent)</option>
                    <option value="48h">48 Heures</option>
                    <option value="72h">72 Heures</option>
                    <option value="1 semaine">1 Semaine</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="sig"
                    checked={instruction.apposerSignature}
                    onChange={(e) => setInstruction({ ...instruction, apposerSignature: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                  <label htmlFor="sig" className="font-bold text-slate-800 cursor-pointer flex items-center gap-1">
                    <FileSignature size={15} className="text-amber-600" /> Apposer le Visa DG
                  </label>
                </div>
              </div>

              {/* BOUTON DE VALIDATION */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Send size={15} /> Valider & Transmettre l'Instruction
                </button>
              </div>

            </form>

          </div>
        )}
      </div>

    </div>
  );
}