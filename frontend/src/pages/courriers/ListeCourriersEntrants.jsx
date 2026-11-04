import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, RefreshCw, Plus, FileText, Paperclip, Eye, 
  Trash2, Calendar, Filter, X, AlertCircle, Clock, 
  MoreVertical, Mail, Phone
} from 'lucide-react';

import { authFetch } from '../api/apiClient.js';

const ORDRE_PERIODES = [
  "Aujourd'hui",
  "Hier",
  "Avant-hier",
  "Ce mois-ci",
  "Mois dernier",
  "Plus ancien"
];

const getCategorieTemporelle = (dateString) => {
  if (!dateString) return "Plus ancien";

  const dateEnregistrement = new Date(dateString);
  if (isNaN(dateEnregistrement.getTime())) return "Plus ancien";

  const maintenant = new Date();
  const aujourdhui = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
  const cible = new Date(dateEnregistrement.getFullYear(), dateEnregistrement.getMonth(), dateEnregistrement.getDate());

  const diffMs = aujourdhui - cible;
  const diffJours = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffJours === 0) return "Aujourd'hui";
  if (diffJours === 1) return "Hier";
  if (diffJours === 2) return "Avant-hier";

  if (dateEnregistrement.getMonth() === maintenant.getMonth() && dateEnregistrement.getFullYear() === maintenant.getFullYear()) {
    return "Ce mois-ci";
  }

  const moisDernier = new Date(maintenant.getFullYear(), maintenant.getMonth() - 1, 1);
  if (dateEnregistrement.getMonth() === moisDernier.getMonth() && dateEnregistrement.getFullYear() === moisDernier.getFullYear()) {
    return "Mois dernier";
  }

  return "Plus ancien";
};

// Fonction pour formater en chiffres : JJ/MM/AAAA
const formatNumDate = (dateString) => {
  if (!dateString) return '--/--/----';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '--/--/----';
  const jour = String(d.getDate()).padStart(2, '0');
  const mois = String(d.getMonth() + 1).padStart(2, '0');
  const annee = d.getFullYear();
  return `${jour}/${mois}/${annee}`;
};

// Fonction utilitaire pour générer des couleurs par expéditeur
const getAvatarBg = (name) => {
  const colors = [
    'bg-orange-500', 'bg-blue-600', 'bg-purple-600', 
    'bg-teal-600', 'bg-pink-500', 'bg-emerald-500'
  ];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

function ListeCourriersEntrants() {
  const navigate = useNavigate();

  const [courriers, setCourriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');

  const [selectedCourrier, setSelectedCourrier] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const fetchCourriers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch('http://127.0.0.1:8000/api/courriers-entrants/');
      if (!response.ok) throw new Error('Impossible de charger les courriers entrants');
      const data = await response.json();
      
      const listData = Array.isArray(data) 
        ? data 
        : (data?.results && Array.isArray(data.results) ? data.results : []);

      setCourriers(listData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourriers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce courrier entrant ?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await authFetch(`http://127.0.0.1:8000/api/courriers-entrants/${id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCourriers((prev) => prev.filter((c) => c.id !== id));
        if (selectedCourrier?.id === id) setSelectedCourrier(null);
      } else {
        alert("Erreur lors de la suppression du courrier.");
      }
    } catch (err) {
      console.error("Erreur de suppression :", err);
      alert("Impossible de joindre le serveur.");
    } finally {
      setDeletingId(null);
      setActiveMenuId(null);
    }
  };

  const toggleSelectRow = (id) => {
    setSelectedRows((prev) => 
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = (sectionItems) => {
    const itemIds = sectionItems.map((item) => item.id);
    const allSelected = itemIds.every((id) => selectedRows.includes(id));
    
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !itemIds.includes(id)));
    } else {
      setSelectedRows((prev) => Array.from(new Set([...prev, ...itemIds])));
    }
  };

  const safeCourriers = Array.isArray(courriers) ? courriers : [];

  const courriersFiltres = safeCourriers.filter((c) => {
    if (!c) return false;

    const term = searchTerm.toLowerCase();
    const matchText = 
      (c.numero_ordre && String(c.numero_ordre).toLowerCase().includes(term)) ||
      (c.reference && String(c.reference).toLowerCase().includes(term)) ||
      (c.objet && String(c.objet).toLowerCase().includes(term)) ||
      (c.nom_expediteur && String(c.nom_expediteur).toLowerCase().includes(term));

    const dateAjout = c.date_creation ? new Date(c.date_creation) : null;
    
    const dateFinMax = dateFin ? new Date(`${dateFin}T23:59:59`) : null;
    const dateDebutMin = dateDebut ? new Date(`${dateDebut}T00:00:00`) : null;

    const matchDateDebut = dateDebutMin ? (dateAjout && dateAjout >= dateDebutMin) : true;
    const matchDateFin = dateFinMax ? (dateAjout && dateAjout <= dateFinMax) : true;

    let matchStatut = true;
    if (filtreStatut === 'urgent') matchStatut = Boolean(c.droit_de_reponse);
    if (filtreStatut === 'confidentiel') matchStatut = Boolean(c.confidentialite);

    return matchText && matchDateDebut && matchDateFin && matchStatut;
  });

  const courriersTries = [...courriersFiltres].sort((a, b) => {
    const timeA = a?.date_creation ? new Date(a.date_creation).getTime() : 0;
    const timeB = b?.date_creation ? new Date(b.date_creation).getTime() : 0;
    return timeB - timeA;
  });

  const courriersGroupes = courriersTries.reduce((acc, c) => {
    const categorie = getCategorieTemporelle(c?.date_creation);
    if (!acc[categorie]) acc[categorie] = [];
    acc[categorie].push(c);
    return acc;
  }, {});

  const resetFilters = () => {
    setSearchTerm('');
    setDateDebut('');
    setDateFin('');
    setFiltreStatut('tous');
  };

  const renderStatusBadge = (courrier) => {
    if (courrier.droit_de_reponse) {
      return (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold border border-purple-300 text-purple-600 bg-purple-50/50 truncate max-w-full">
          Pending
        </span>
      );
    }
    if (courrier.confidentialite) {
      return (
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold border border-amber-300 text-amber-600 bg-amber-50/50 truncate max-w-full">
          On-Hold
        </span>
      );
    }
    return (
      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold border border-emerald-300 text-emerald-600 bg-emerald-50/50 truncate max-w-full">
        Candidate
      </span>
    );
  };

  return (
    /* Correction : Remplacement de overflow-hidden par overflow-y-auto et adaptation de la hauteur */
    <div className="w-full h-full max-h-screen overflow-y-auto space-y-6 font-sans text-gray-700 bg-gray-50/30 p-4 rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Courriers</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Affichage de {courriersFiltres.length} sur {safeCourriers.length} données
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCourriers}
            className="p-2 text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition shadow-sm cursor-pointer"
            title="Actualiser la liste"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={() => navigate("nouveau")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Nouveau courrier entrant
          </button>
        </div>
      </div>

      {/* Barre de Filtres */}
      <div className="bg-white p-4 border border-gray-100 rounded-2xl space-y-3 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-gray-50/30"
            />
          </div>

          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-2.5 py-1.5 bg-gray-50/30">
            <span className="text-[10px] text-gray-400 font-medium shrink-0">Ajouté du :</span>
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="bg-transparent text-xs text-gray-700 w-full focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-2.5 py-1.5 bg-gray-50/30">
            <span className="text-[10px] text-gray-400 font-medium shrink-0">Au :</span>
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="bg-transparent text-xs text-gray-700 w-full focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-xl p-2 focus:outline-none bg-white text-gray-600 cursor-pointer"
            >
              <option value="tous">Tous les courriers</option>
              <option value="urgent">Pending (Réponse requise)</option>
              <option value="confidentiel">On-Hold (Confidentiel)</option>
            </select>
          </div>
        </div>

        {(searchTerm || dateDebut || dateFin || filtreStatut !== 'tous') && (
          <div className="flex justify-end pt-1">
            <button
              onClick={resetFilters}
              className="text-xs text-red-500 hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <X className="w-3 h-3" /> Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}. Vérifiez la connexion au backend Django.</p>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-600" />
          <p className="text-xs">Chargement de la liste des courriers...</p>
        </div>
      ) : courriersTries.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <FileText className="w-10 h-10 mx-auto text-gray-300" />
          <p className="text-sm font-medium">Aucun courrier ne correspond à votre recherche</p>
          <p className="text-xs text-gray-400">
            {searchTerm || dateDebut || dateFin ? "Essayez de modifier la plage de dates." : "Cliquez sur + Nouveau courrier entrant pour en ajouter."}
          </p>
        </div>
      ) : (
        <div className="space-y-6 pb-8">
          {ORDRE_PERIODES.map((periode) => {
            const listeSect = courriersGroupes[periode];
            if (!listeSect || listeSect.length === 0) return null;

            const isAllSectionSelected = listeSect.every((item) => selectedRows.includes(item.id));

            return (
              <div key={periode} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-100/70 px-3 py-1.5 rounded-xl w-fit">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ajouté : {periode}</span>
                  <span className="bg-white text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs">
                    {listeSect.length}
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs table-fixed">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 font-bold text-gray-400 uppercase text-[10px] tracking-wider">
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={isAllSectionSelected}
                            onChange={() => toggleSelectAll(listeSect)}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </th>
                        <th className="p-3 w-28">ID</th>
                        <th className="p-3 w-28">Date Applied</th>
                        <th className="p-3 w-1/4">Company</th>
                        <th className="p-3 w-24">Type</th>
                        <th className="p-3 w-1/4">Position</th>
                        <th className="p-3 w-20 text-center">Contact</th>
                        <th className="p-3 w-28 text-center">Status</th>
                        <th className="p-3 w-10 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {listeSect.map((c, idx) => {
                        const isSelected = selectedRows.includes(c.id);
                        const expediteurNom = c.nom_expediteur || c.expediteur || 'Expéditeur inconnu';
                        const initial = expediteurNom.charAt(0).toUpperCase();

                        return (
                          <tr 
                            key={c.id || idx} 
                            className={`hover:bg-gray-50/80 transition-colors ${isSelected ? 'bg-indigo-50/20' : ''}`}
                          >
                            {/* Case à cocher */}
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectRow(c.id)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                            </td>

                            {/* ID */}
                            <td className="p-3 font-bold text-gray-800 truncate" title={`#APL-${(c.numero_ordre || c.id || 0).toString().padStart(4, '0')}`}>
                              #APL-{(c.numero_ordre || c.id || 0).toString().padStart(4, '0')}
                            </td>

                            {/* Date Applied (Chiffres uniquement JJ/MM/AAAA) */}
                            <td className="p-3 text-gray-500 font-medium truncate">
                              {formatNumDate(c.date_creation)}
                            </td>

                            {/* Company / Expéditeur */}
                            <td className="p-3">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0 ${getAvatarBg(expediteurNom)}`}>
                                  {initial}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-bold text-gray-800 truncate" title={expediteurNom}>
                                    {expediteurNom}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-normal truncate" title={c.structure_expediteur || 'Structure non renseignée'}>
                                    {c.structure_expediteur || 'Structure non renseignée'}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Type / Référence */}
                            <td className="p-3 font-extrabold text-gray-600 uppercase tracking-wider text-[10px] truncate" title={c.reference || 'FREELANCE'}>
                              {c.reference || 'FREELANCE'}
                            </td>

                            {/* Position / Objet (Tronqué avec ...) */}
                            <td className="p-3 text-gray-700 font-medium truncate" title={c.objet || ''}>
                              {c.objet || 'Sans objet'}
                            </td>

                            {/* Contact / Pièces Jointes */}
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1 text-gray-600">
                                {c.pieces_jointes && Array.isArray(c.pieces_jointes) && c.pieces_jointes.length > 0 ? (
                                  c.pieces_jointes.map((pj, pIdx) => (
                                    <a
                                      key={pj.id || pIdx}
                                      href={pj.url_complete || pj.repertoire_pj || '#'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors"
                                      title={pj.nom_original || 'Pièce jointe'}
                                    >
                                      <Paperclip className="w-3.5 h-3.5" />
                                    </a>
                                  ))
                                ) : (
                                  <>
                                    <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors cursor-pointer" title="Contacter">
                                      <Phone className="w-3.5 h-3.5" />
                                    </button>
                                    <button className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors cursor-pointer" title="Message">
                                      <Mail className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>

                            {/* Statut Style Bouton */}
                            <td className="p-3 text-center">
                              {renderStatusBadge(c)}
                            </td>

                            {/* Bouton 3 Points Action */}
                            <td className="p-3 text-right relative">
                              <button
                                onClick={() => setActiveMenuId(activeMenuId === c.id ? null : c.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {/* Dropdown Menu */}
                              {activeMenuId === c.id && (
                                <div className="absolute right-2 top-9 w-32 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 text-left">
                                  <button
                                    onClick={() => { setSelectedCourrier(c); setActiveMenuId(null); }}
                                    className="w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-indigo-600" />
                                    Détails
                                  </button>
                                  <button
                                    onClick={() => handleDelete(c.id)}
                                    disabled={deletingId === c.id}
                                    className="w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Supprimer
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Détails */}
      {selectedCourrier && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  #APL-{(selectedCourrier.numero_ordre || selectedCourrier.id || 0).toString().padStart(4, '0')}
                </span>
                <h2 className="text-lg font-bold text-gray-800 mt-2">
                  Référence : {selectedCourrier.reference || 'Aucune'}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCourrier(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-400 font-medium">Date du courrier (document)</p>
                <p className="font-semibold text-gray-800">{formatNumDate(selectedCourrier.date)}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Date d'ajout système</p>
                <p className="font-semibold text-indigo-600">
                  {formatNumDate(selectedCourrier.date_creation)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Expéditeur / Company</p>
                <p className="font-semibold text-gray-800">{selectedCourrier.nom_expediteur || selectedCourrier.expediteur || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Structure</p>
                <p className="font-semibold text-gray-800">{selectedCourrier.structure_expediteur || 'Non renseignée'}</p>
              </div>
              <div className="col-span-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-gray-400 font-medium mb-1">Objet / Position</p>
                <p className="text-gray-800 font-medium leading-relaxed">{selectedCourrier.objet || 'Aucun'}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-700 mb-2">Pièces jointes</p>
              {selectedCourrier.pieces_jointes && Array.isArray(selectedCourrier.pieces_jointes) && selectedCourrier.pieces_jointes.length > 0 ? (
                <div className="space-y-2">
                  {selectedCourrier.pieces_jointes.map((pj, idx) => (
                    <a
                      key={pj.id || idx}
                      href={pj.url_complete || pj.repertoire_pj || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 font-semibold transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        {pj.nom_original || 'Document joint'}
                      </span>
                      <span className="text-[10px] text-indigo-600 font-normal">Ouvrir / Télécharger ↗</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">Aucune pièce jointe liée.</p>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setSelectedCourrier(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListeCourriersEntrants;