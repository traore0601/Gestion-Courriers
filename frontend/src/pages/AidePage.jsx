import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  Phone, 
  Send, 
  FileText, 
  CheckCircle2, 
  BookOpen 
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    id: 1,
    question: "Comment enregistrer un nouveau courrier d'arrivée ?",
    answer: "Accédez au menu 'Courriers Arrivée', cliquez sur le bouton '+ Nouveau Courrier', remplissez l'expéditeur, l'objet, la date de réception, puis joignez le document scanné au format PDF avant de valider."
  },
  {
    id: 2,
    question: "Comment fonctionne la numérotation automatique d'ordre ?",
    answer: "Le numéro d'ordre est généré automatiquement selon le format défini dans les 'Paramètres système' (ex: ARR-2026-0001). Il s'incrémente à chaque enregistrement."
  },
  {
    id: 3,
    question: "Comment affecter ou transmettre un courrier à un service ?",
    answer: "Ouvrez la fiche du courrier concerné, cliquez sur le bouton 'Transmettre / Affecter', sélectionnez le service destinataire ainsi que l'agent responsable, puis ajoutez une note d'instruction si nécessaire."
  },
  {
    id: 4,
    question: "Que faire en cas de notification d'expiration de délai ?",
    answer: "Consultez l'onglet 'Notifications' pour identifier le courrier concerné. Rendez-vous sur la fiche du courrier pour marquer le traitement comme 'Terminé' ou 'Répondu' afin de lever l'alerte."
  },
  {
    id: 5,
    question: "Comment réinitialiser mon mot de passe ou mes accès ?",
    answer: "Contactez directement le service informatique via le formulaire de support ci-dessous ou par téléphone à l'extension interne 104."
  }
];

function Aide() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [ticketSent, setTicketSent] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'Technique',
    message: ''
  });

  const filteredFaq = FAQ_ITEMS.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleTicketSubmit = (e) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.message) return;
    setTicketSent(true);
    setTicketForm({ subject: '', category: 'Technique', message: '' });
    setTimeout(() => setTicketSent(false), 4000);
  };

  return (
    <div className="w-full space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Aide & Support</h1>
        <p className="text-xs text-gray-500 mt-1">
          Centre d'assistance et de documentation pour la gestion du courrier.
        </p>
      </div>

      {/* Barre de recherche FAQ */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-200" />
          <h2 className="text-base font-semibold">Comment pouvons-nous vous aider ?</h2>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une question ou un mot-clé (ex: numérotation, affectation...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white text-gray-800 placeholder-gray-400 text-xs rounded-lg shadow-inner outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section FAQ (2 Colonnes) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Foire Aux Questions (FAQ)
            </h3>
            <span className="text-[11px] text-gray-400">
              {filteredFaq.length} réponse{filteredFaq.length > 1 ? 's' : ''} disponible{filteredFaq.length > 1 ? 's' : ''}
            </span>
          </div>

          {filteredFaq.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-400 text-xs">
              Aucune réponse trouvée pour "{searchTerm}".
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFaq.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left px-4 py-3 text-xs font-semibold text-gray-800 flex items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors cursor-pointer"
                    >
                      <span className="flex-1">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-3.5 pt-1 text-xs text-gray-600 border-t border-gray-100 bg-gray-50/50 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Panneau de contact Support IT (1 Colonne) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wider">
            <Mail className="w-4 h-4 text-blue-600" />
            Contact IT Direct
          </h3>

          {/* Carte Coordonnées */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-xs text-gray-700">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold">Support Téléphonique</p>
                <p className="text-[11px] text-gray-500">Poste interne : 104 / +225 07 00 00 00</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-700 pt-2 border-t border-gray-100">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold">Email d'Assistance</p>
                <p className="text-[11px] text-gray-500">support.informatique@aib.ci</p>
              </div>
            </div>
          </div>

          {/* Formulaire de Ticket */}
          <form onSubmit={handleTicketSubmit} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-gray-800">Ouvrir un ticket de support</h4>

            {ticketSent && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ticket transmis avec succès au service DSI.</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Catégorie</label>
              <select
                value={ticketForm.category}
                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                className="w-full p-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white"
              >
                <option value="Technique">Bug / Dysfonctionnement</option>
                <option value="Compte">Accès & Droit utilisateur</option>
                <option value="Numérotation">Problème de Numérotation</option>
                <option value="Autre">Autre demande</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Objet</label>
              <input
                type="text"
                placeholder="Ex: Impossibilité d'imprimer un bordereau"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                className="w-full p-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                rows="3"
                placeholder="Décrivez votre problème avec précision..."
                value={ticketForm.message}
                onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                className="w-full p-2 text-xs border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Envoyer au support</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Aide;