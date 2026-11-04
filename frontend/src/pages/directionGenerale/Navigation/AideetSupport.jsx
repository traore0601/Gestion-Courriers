import React, { useState } from 'react';
import { 
  HelpCircle, 
  BookOpen, 
  Headphones, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  CheckCircle2, 
  FileText, 
  ShieldAlert, 
  Clock, 
  MessageSquare
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 1,
    question: "Comment annoter et transmettre un courrier à une direction spécifique ?",
    reponse: "Dans la Boîte de Réception ou l'onglet Tâches à traiter, sélectionnez le courrier concerné puis cliquez sur le bouton 'Annoter / Transmettre'. Choisissez le service destinataire (ex: DAF, DSI, DRH) et saisissez votre instruction."
  },
  {
    id: 2,
    question: "Comment activer la délégation de pouvoir lors de mes déplacements ?",
    reponse: "Rendez-vous dans la page Paramètres, onglet 'Délégation de pouvoir'. Activez l'option, désignez le suppléant (ex: Secrétaire Général ou DGA) et définissez les dates de début et de fin."
  },
  {
    id: 3,
    question: "Qui a accès aux courriers marqués 'Confidentiel' ?",
    reponse: "Les courriers portant le statut 'Confidentiel' ne sont visibles que par vous-même (Directeur Général) et le Secrétariat Général restreint habilité à leur enregistrement."
  },
  {
    id: 4,
    question: "Que faire si un document joint ne s'affiche pas correctement ?",
    reponse: "Assurez-vous que le fichier est au format PDF ou image. Si le problème persiste, cliquez sur 'Contacter le Support IT' ci-dessous pour signaler un incident technique à la DSI."
  }
];

export default function AideetSupportDG() {
  const [activeTab, setActiveTab] = useState('faq');
  const [openFaqId, setOpenFaqId] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Formulaire de support IT
  const [ticket, setTicket] = useState({
    sujet: '',
    priorite: 'Normale',
    description: ''
  });

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleSendTicket = (e) => {
    e.preventDefault();
    if (!ticket.sujet || !ticket.description) return alert("Veuillez remplir tous les champs.");
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTicket({ sujet: '', priorite: 'Normale', description: '' });
    }, 4000);
  };

  return (
    <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-2xl flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* 1. MENU NAVIGATION AIDE (GAUCHE) */}
      <div className="w-full md:w-1/4 bg-white border-r border-slate-200 p-4 space-y-1">
        <h2 className="text-sm font-bold text-slate-900 px-3 py-2 mb-2">Centre d'Aide</h2>

        <button
          onClick={() => setActiveTab('faq')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'faq' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <HelpCircle size={16} /> Foire aux Questions (FAQ)
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'guide' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen size={16} /> Guide d'Utilisation DG
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'support' ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Headphones size={16} /> Contacter le Support IT
        </button>
      </div>

      {/* 2. CONTENU DU PANNEAU (DROITE) */}
      <div className="w-full md:w-3/4 bg-white p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          {/* SECTION 1 : FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-sm font-bold text-slate-900">Foire aux Questions</h3>
                <p className="text-xs text-slate-500">Trouvez rapidement des réponses aux questions relatives à la gestion des courriers.</p>
              </div>

              <div className="space-y-2 pt-2">
                {FAQ_ITEMS.map((item) => (
                  <div key={item.id} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleFaq(item.id)}
                      className="w-full flex justify-between items-center p-3 text-left bg-slate-50 hover:bg-slate-100/80 transition text-xs font-bold text-slate-800"
                    >
                      <span>{item.question}</span>
                      {openFaqId === item.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openFaqId === item.id && (
                      <div className="p-3 text-xs text-slate-600 leading-relaxed border-t border-slate-200 bg-white">
                        {item.reponse}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2 : GUIDE RAPIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-sm font-bold text-slate-900">Guide de Prise en Main - Direction Générale</h3>
                <p className="text-xs text-slate-500">Les 3 étapes clés pour traiter vos courriers au quotidien.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="w-7 h-7 bg-amber-500 text-slate-950 rounded-lg flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Examen des courriers</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Consultez vos courriers arrivants par niveau d'urgence et priorité dans la Boîte de Réception.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="w-7 h-7 bg-amber-500 text-slate-950 rounded-lg flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Instruction & Visa</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Ajoutez vos annotations pour orienter les dossiers vers les directions ou validez directement.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="w-7 h-7 bg-amber-500 text-slate-950 rounded-lg flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Suivi des exécutions</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Suivez le traitement des tâches transmises dans l'onglet dédié pour un contrôle continu.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3 : SUPPORT TECHNIQUE (TICKET DSI) */}
          {activeTab === 'support' && (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="text-sm font-bold text-slate-900">Assistance Technique DSI</h3>
                <p className="text-xs text-slate-500">Transmettez une demande prioritaire à l'équipe informatique.</p>
              </div>

              {submitted ? (
                <div className="p-4 bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span>Votre ticket d'assistance prioritaire a été transmis à la DSI. Un technicien va vous contacter.</span>
                </div>
              ) : (
                <form onSubmit={handleSendTicket} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Objet de la demande</label>
                    <input
                      type="text"
                      placeholder="Ex: Problème d'ouverture d'un fichier joint..."
                      value={ticket.sujet}
                      onChange={(e) => setTicket({ ...ticket, sujet: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Niveau d'urgence</label>
                    <select
                      value={ticket.priorite}
                      onChange={(e) => setTicket({ ...ticket, priorite: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs outline-none font-medium"
                    >
                      <option value="Normale">Normale</option>
                      <option value="Haute">Haute (Blocage d'un courrier urgent)</option>
                      <option value="Critique">Critique (Problème d'accès à l'application)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description détaillée</label>
                    <textarea
                      rows="4"
                      placeholder="Décrivez brièvement le problème rencontré..."
                      value={ticket.description}
                      onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                    ></textarea>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition"
                    >
                      <Send size={14} /> Envoyer la demande au Support
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* PIED DE PAGE : INFORMATIONS CONTACT RAPIDE */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Système de Gestion de Courrier v2.0</span>
          <span className="font-semibold text-slate-700">Support Interne DSI : Ext. 104 / support@entreprise.ci</span>
        </div>
      </div>

    </div>
  );
}