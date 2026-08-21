import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, RefreshCw, Plus, FileText, Paperclip, Eye, 
  Trash2, Calendar, Filter, X, AlertCircle, Clock
} from 'lucide-react';

// Ordre strict des périodes
const ORDRE_PERIODES = [
  "Aujourd'hui",
  "Hier",
  "Avant-hier",
  "Ce mois-ci",
  "Mois dernier",
  "Plus ancien"
];

// Fonction pour déterminer la catégorie temporelle à partir de la date d'enregistrement
const getCategorieTemporelle = (dateString) => {
  if (!dateString) return "Plus ancien";

  const dateEnregistrement = new Date(dateString);
  const maintenant = new Date();

  // On compare uniquement les dates (sans les heures/minutes)
  const aujourdhui = new Date(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
  const cible = new Date(dateEnregistrement.getFullYear(), dateEnregistrement.getMonth(), dateEnregistrement.getDate());

  const diffMs = aujourdhui - cible;
  const diffJours = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffJours === 0) return "Aujourd'hui";
  if (diffJours === 1) return "Hier";
  if (diffJours === 2) return "Avant-hier";

  // Même mois / Année
  if (dateEnregistrement.getMonth() === maintenant.getMonth() && dateEnregistrement.getFullYear() === maintenant.getFullYear()) {
    return "Ce mois-ci";
  }

  // Mois dernier
  const moisDernier = new Date(maintenant.getFullYear(), maintenant.getMonth() - 1, 1);
  if (dateEnregistrement.getMonth() === moisDernier.getMonth() && dateEnregistrement.getFullYear() === moisDernier.getFullYear()) {
    return "Mois dernier";
  }

  return "Plus ancien";
};

function ListeCourriersEntrants() {
  const navigate = useNavigate();

  // États pour les données et le chargement
  const [courriers, setCourriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [filtreStatut, setFiltreStatut] = useState('tous');

  // États pour la modal et la suppression
  const [selectedCourrier, setSelectedCourrier] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Récupération des données depuis le backend Django
  const fetchCourriers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/courriers-entrants/');
      if (!response.ok) throw new Error('Impossible de charger les courriers entrants');
      const data = await response.json();
      setCourriers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourriers();
  }, []);

  // Supprimer un courrier
  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce courrier entrant ?")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/courriers-entrants/${id}/`, {
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
    }
  };

  // 1. Filtrage combiné
  const courriersFiltres = courriers.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchText = 
      (c.numero_ordre && c.numero_ordre.toString().includes(term)) ||
      (c.reference && c.reference.toLowerCase().includes(term)) ||
      (c.objet && c.objet.toLowerCase().includes(term)) ||
      (c.nom_expediteur && c.nom_expediteur.toLowerCase().includes(term));

    const dateCourrier = c.date ? new Date(c.date) : null;
    const matchDateDebut = dateDebut ? (dateCourrier && dateCourrier >= new Date(dateDebut)) : true;
    const matchDateFin = dateFin ? (dateCourrier && dateCourrier <= new Date(dateFin)) : true;

    let matchStatut = true;
    if (filtreStatut === 'urgent') matchStatut = c.droit_de_reponse === true;
    if (filtreStatut === 'confidentiel') matchStatut = c.confidentialite === true;

    return matchText && matchDateDebut && matchDateFin && matchStatut;
  });

  // 2. Tri strict du plus récent au plus ancien par date/heure d'enregistrement (created_at)
  const courriersTries = [...courriersFiltres].sort((a, b) => {
    const timeA = a.created_at ? new Date(a.created_at).getTime() : a.id;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : b.id;
    return timeB - timeA;
  });

  // 3. Regroupement par période (Aujourd'hui, Hier, Avant-hier, Ce mois-ci, etc.)
  const courriersGroupes = courriersTries.reduce((acc, c) => {
    const categorie = getCategorieTemporelle(c.created_at);
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

  return (
    <div className="w-full space-y-6 font-sans">
      
      {/* Entête principal */}
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Courriers Entrants</h1>
          <p className="text-sm text-gray-500">
            Enregistrements classés par ordre chronologique ({courriersFiltres.length} sur {courriers.length})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCourriers}
            className="p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            title="Actualiser la liste"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={() => navigate('/courriers-arrives')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Nouveau courrier entrant
          </button>
        </div>
      </div>

      {/* Recherche et filtres */}
      <div className="bg-white p-4 border border-gray-200 rounded-xl space-y-3 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="N°, référence, objet, expéditeur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50/50">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="bg-transparent text-xs text-gray-700 w-full focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-gray-50/50">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="bg-transparent text-xs text-gray-700 w-full focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={filtreStatut}
              onChange={(e) => setFiltreStatut(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 focus:outline-none bg-white"
            >
              <option value="tous">Tous les courriers</option>
              <option value="urgent">Réponse requise</option>
              <option value="confidentiel">Confidentiels uniquement</option>
            </select>
          </div>

        </div>

        {(searchTerm || dateDebut || dateFin || filtreStatut !== 'tous') && (
          <div className="flex justify-end pt-1">
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:underline flex items-center gap-1 font-medium"
            >
              <X className="w-3 h-3" /> Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}. Vérifiez le serveur Django sur `http://127.0.0.1:8000`.</p>
        </div>
      )}

      {/* Liste des courriers groupée par période */}
      {loading ? (
        <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-xs">Chargement de la liste des courriers...</p>
        </div>
      ) : courriersTries.length === 0 ? (
        <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200 space-y-2">
          <FileText className="w-10 h-10 mx-auto text-gray-300" />
          <p className="text-sm font-medium">Aucun courrier entrant trouvé</p>
          <p className="text-xs text-gray-400">
            {searchTerm || dateDebut || dateFin ? "Essayez de modifier vos filtres." : "Cliquez sur + Nouveau courrier entrant pour en ajouter."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {ORDRE_PERIODES.map((periode) => {
            const listeSect = courriersGroupes[periode];
            if (!listeSect || listeSect.length === 0) return null;

            return (
              <div key={periode} className="space-y-2">
                {/* Badge de Période */}
                <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-100/80 px-3 py-1.5 rounded-lg w-fit border border-gray-200">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{periode}</span>
                  <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded-full">
                    {listeSect.length}
                  </span>
                </div>

                {/* Tableau pour la période */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 font-semibold text-gray-500 uppercase text-[10px]">
                          <th className="p-3">N° Ordre</th>
                          <th className="p-3">Référence</th>
                          <th className="p-3">Date Courrier</th>
                          <th className="p-3">Expéditeur</th>
                          <th className="p-3">Objet</th>
                          <th className="p-3">Pièces Jointes</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {listeSect.map((c) => (
                          <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                            <td className="p-3 font-bold text-blue-600 whitespace-nowrap">#{c.numero_ordre}</td>
                            <td className="p-3 font-semibold text-gray-800 whitespace-nowrap">{c.reference || '-'}</td>
                            <td className="p-3 text-gray-500 whitespace-nowrap">
                              {c.date ? new Date(c.date).toLocaleDateString('fr-FR') : '-'}
                            </td>
                            <td className="p-3 text-gray-700 font-medium">{c.nom_expediteur || '-'}</td>
                            <td className="p-3 text-gray-800 max-w-xs truncate" title={c.objet}>{c.objet}</td>
                            
                            <td className="p-3">
                              {c.pieces_jointes && c.pieces_jointes.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {c.pieces_jointes.map((pj) => (
                                    <a
                                      key={pj.id}
                                      href={pj.fichier}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded font-semibold hover:bg-blue-100 transition-colors"
                                    >
                                      <Paperclip className="w-3 h-3" /> Fichier
                                    </a>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">Aucune</span>
                              )}
                            </td>

                            <td className="p-3 text-right whitespace-nowrap space-x-1">
                              <button
                                onClick={() => setSelectedCourrier(c)}
                                className="p-1.5 text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded border transition-colors"
                                title="Détails"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDelete(c.id)}
                                disabled={deletingId === c.id}
                                className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-colors disabled:opacity-50"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  N° Ordre #{selectedCourrier.numero_ordre}
                </span>
                <h2 className="text-lg font-bold text-gray-800 mt-1">
                  Référence : {selectedCourrier.reference || 'Aucune'}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCourrier(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-400 font-medium">Date du courrier</p>
                <p className="font-semibold text-gray-800">{selectedCourrier.date}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Date d'enregistrement système</p>
                <p className="font-semibold text-blue-600">
                  {selectedCourrier.created_at ? new Date(selectedCourrier.created_at).toLocaleString('fr-FR') : 'Non renseignée'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Expéditeur</p>
                <p className="font-semibold text-gray-800">{selectedCourrier.nom_expediteur || 'Non renseigné'}</p>
              </div>
              <div>
                <p className="text-gray-400 font-medium">Structure</p>
                <p className="font-semibold text-gray-800">{selectedCourrier.structure_expediteur || 'Non renseignée'}</p>
              </div>
              <div className="col-span-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-gray-400 font-medium mb-1">Objet du courrier</p>
                <p className="text-gray-800 font-medium leading-relaxed">{selectedCourrier.objet}</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-700 mb-2">Pièces jointes</p>
              {selectedCourrier.pieces_jointes && selectedCourrier.pieces_jointes.length > 0 ? (
                <div className="space-y-2">
                  {selectedCourrier.pieces_jointes.map((pj) => (
                    <a
                      key={pj.id}
                      href={pj.fichier}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs text-blue-700 font-semibold transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        {pj.nom_original || 'Document joint'}
                      </span>
                      <span className="text-[10px] text-blue-600 font-normal">Ouvrir / Télécharger ↗</span>
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
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition-colors"
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