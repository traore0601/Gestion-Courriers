import React, { useState, useEffect } from 'react';
import { Mail, FileText, Download, Calendar, Loader, X, Paperclip, Shield, AlertTriangle } from 'lucide-react';
import { authFetch } from '../../api/apiClient.js';
import { useAuth } from '../../context/AuthContext.jsx';

const BoitedeReception = () => {
  const [courriers, setCourriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Tout');
  const [selectedCourrier, setSelectedCourrier] = useState(null); // Gère le courrier sélectionné pour le panneau latéral
  const { user } = useAuth();

  useEffect(() => {
    fetchCourriersRecus();
  }, []);

  const fetchCourriersRecus = async () => {
    setLoading(true);
    try {
      const response = await authFetch('http://127.0.0.1:8000/api/courriers-entrants/');
      if (response.ok) {
        const data = await response.json();
        setCourriers(data);
      } else {
        console.error("Erreur lors de la récupération des courriers");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgePriorite = (p) => {
    switch (p?.toLowerCase()) {
      case 'tres_urgente':
      case 'urgente':
        return 'bg-red-600 text-white';
      case 'importante':
        return 'bg-amber-600 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const isAmpliateur = (courrier) => {
    if (!user || !user.personnel) return false;
    return courrier.ampliateurs_details?.some(
      (amp) => amp.personnel === user.personnel
    );
  };

  // Filtrage selon l'onglet
  const filteredCourriers = courriers.filter((c) => {
    if (filter === 'Urgent') return c.priorite === 'urgente' || c.priorite === 'tres_urgente';
    if (filter === 'En cours') return c.statut === 'en_cours';
    if (filter === 'À traiter') return c.statut === 'a_assigner' || c.statut === 'arrive';
    return true;
  });

  return (
    <div className="w-full flex h-screen overflow-hidden bg-slate-50">
      
      {/* Conteneur principal (prend toute la largeur, ou se réduit si le panneau latéral est ouvert) */}
      <main className={`flex-1 flex flex-col h-full transition-all duration-300 overflow-hidden ${selectedCourrier ? 'mr-[450px] lg:mr-[500px]' : ''}`}>
        
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="text-base font-bold text-slate-800 mb-2">
            Courriers Reçus
          </h2>
          <div className="flex space-x-3 text-xs">
            {['Tout', 'Urgent', 'En cours', 'À traiter'].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`font-semibold cursor-pointer ${
                  filter === item 
                    ? 'text-red-600 border-b-2 border-red-600' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                [{item}]
              </button>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center p-8 text-slate-500 gap-2">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Chargement des courriers reçus...</span>
            </div>
          ) : filteredCourriers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-xl border border-slate-200">
              Aucun courrier trouvé pour cette sélection.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold sticky top-0">
                  <tr>
                    <th className="p-3">Date du Courrier</th>
                    <th className="p-3">Expéditeur</th>
                    <th className="p-3">Objet</th>
                    <th className="p-3">Numéro d'Ordre / Réf.</th>
                    <th className="p-3">Rôle</th>
                    <th className="p-3">Priorité</th>
                    <th className="p-3">Pièces Jointes</th>
                    <th className="p-3">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredCourriers.map((c) => {
                    const enCopie = isAmpliateur(c);
                    const isSelected = selectedCourrier?.id === c.id;
                    return (
                      <tr 
                        key={c.id} 
                        onClick={() => setSelectedCourrier(c)}
                        className={`transition cursor-pointer ${isSelected ? 'bg-blue-50/80 font-semibold' : 'hover:bg-slate-50'}`}
                        title="Cliquez pour afficher les détails dans le panneau latéral"
                      >
                        <td className="p-3 whitespace-nowrap text-slate-600">
                          <span className="flex items-center gap-1.5">
                            {c.date} <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          </span>
                        </td>
                        <td className="p-3 font-medium text-slate-800">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" /> {c.nom_expediteur} ({c.structure_expediteur || 'N/A'})
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 font-medium truncate max-w-[200px]">{c.objet}</td>
                        <td className="p-3 text-slate-600 font-semibold">{c.numero_ordre}</td>
                        <td className="p-3">
                          {enCopie ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                              Ampliateur (Copie)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
                              Destinataire
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getBadgePriorite(c.priorite)}`}>
                            {c.priorite_display || c.priorite || 'Normal'}
                          </span>
                        </td>
                        <td className="p-3">
                          {c.pieces_jointes && c.pieces_jointes.length > 0 ? (
                            <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                              <Paperclip className="w-3.5 h-3.5" /> {c.pieces_jointes.length} fichier(s)
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Aucune</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="block text-[11px] text-slate-600 font-medium">
                            {c.statut_display || c.statut}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* --- PANNEAU LATÉRAL COULISSANT (ROBUSTE ET PROFESSIONNEL) --- */}
      {selectedCourrier && (
        <aside className="fixed top-0 right-0 w-[450px] lg:w-[500px] h-full bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col transition-transform duration-300 animate-in slide-in-from-right duration-200">
          
          {/* En-tête du panneau */}
          <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Ordre : {selectedCourrier.numero_ordre}
                </span>
                {selectedCourrier.reference && (
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Réf : {selectedCourrier.reference}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {selectedCourrier.objet || 'Sans objet'}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCourrier(null)}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
              title="Fermer le panneau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Corps des informations défilables */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Expéditeur</span>
                <p className="font-semibold text-slate-800">{selectedCourrier.nom_expediteur || 'Inconnu'}</p>
                <p className="text-slate-500 text-[11px]">{selectedCourrier.fonction_expediteur || ''} - {selectedCourrier.structure_expediteur || 'N/A'}</p>
                {selectedCourrier.ville_expediteur && (
                  <p className="text-slate-500 text-[11px]">Ville : {selectedCourrier.ville_expediteur}</p>
                )}
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Signataire & Dates</span>
                <p className="text-slate-700"><strong className="text-slate-800">Signataire :</strong> {selectedCourrier.signataire || 'Non spécifié'}</p>
                <p className="text-slate-700"><strong className="text-slate-800">Date :</strong> {selectedCourrier.date || 'N/A'}</p>
                <p className="text-slate-700"><strong className="text-slate-800">Ajout :</strong> {selectedCourrier.date_creation ? new Date(selectedCourrier.date_creation).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Classification & Statut</span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <p className="text-slate-700"><strong className="text-slate-800">Type :</strong> {selectedCourrier.type_courrier || 'Standard'}</p>
                <p className="text-slate-700"><strong className="text-slate-800">Nature :</strong> {selectedCourrier.nature_courrier || 'Standard'}</p>
              </div>
              <p className="text-slate-700 pt-1"><strong className="text-slate-800">Statut :</strong> <span className="font-semibold text-blue-600">{selectedCourrier.statut_display || selectedCourrier.statut}</span></p>
            </div>

            {/* Options spéciales */}
            {(selectedCourrier.confidentialite || selectedCourrier.droit_de_reponse) && (
              <div className="flex flex-wrap gap-2">
                {selectedCourrier.confidentialite && (
                  <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-lg text-[11px] font-bold flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" /> Confidentiel
                  </span>
                )}
                {selectedCourrier.droit_de_reponse && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-[11px] font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Droit de réponse (Délai : {selectedCourrier.delai_de_reponse || 'N/A'})
                  </span>
                )}
              </div>
            )}

            {/* Instruction / Note */}
            {selectedCourrier.instruction && (
              <div className="bg-amber-50/70 border border-amber-200/60 p-3.5 rounded-xl space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800">Instruction / Note de transmission</span>
                <p className="text-xs text-slate-700 italic">"{selectedCourrier.instruction}"</p>
              </div>
            )}

            {/* Pièces jointes */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" /> Pièces Jointes ({selectedCourrier.pieces_jointes?.length || 0})
              </span>
              {selectedCourrier.pieces_jointes && selectedCourrier.pieces_jointes.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedCourrier.pieces_jointes.map((pj) => (
                    <a
                      key={pj.id}
                      href={pj.url_complete}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-xl text-xs transition-colors group"
                    >
                      <span className="flex items-center gap-2 font-medium text-slate-700 group-hover:text-blue-600 truncate">
                        <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0" />
                        {pj.nom_original}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 shrink-0">
                        <Download className="w-3.5 h-3.5" /> Ouvrir
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Aucune pièce jointe associée à ce courrier.</p>
              )}
            </div>

          </div>

          {/* Pied du panneau avec bouton de fermeture */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              type="button"
              onClick={() => setSelectedCourrier(null)}
              className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Fermer le panneau
            </button>
          </div>

        </aside>
      )}

    </div>
  );
};

export default BoitedeReception;