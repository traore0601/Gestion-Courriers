import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Inbox, 
  Eye, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  RefreshCw,
  X,
  Printer,
  FileText,
  Paperclip,
  Download,
  Folder
} from 'lucide-react';

function EntrantPage() {
  const navigate = useNavigate();

  const [courriers, setCourriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Courrier sélectionné pour la fiche A4
  const [selectedCourrier, setSelectedCourrier] = useState(null);

  const fetchCourriers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/courriers-entrants/');
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      const data = await response.json();
      const liste = Array.isArray(data) ? data : (data.results || []);
      setCourriers(liste);
    } catch (err) {
      console.error('Erreur lors du chargement des courriers :', err);
      setError('Impossible de charger les courriers depuis la base de données.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourriers();
  }, []);

  const handleNouveauCourrier = () => {
    navigate('/courriers-arrives'); 
  };

  const handlePrint = () => {
    window.print();
  };

  const courriersFiltres = courriers.filter((item) => {
    const num = item.reference || item.numero_ordre || item.numero || '';
    const exp = item.nom_expediteur || item.structure_expediteur || item.expediteur || '';
    const obj = item.objet || '';

    const matchSearch = 
      num.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obj.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchSearch;
    const itemStatut = (item.statut || '').toLowerCase();
    return matchSearch && itemStatut === filterStatus.toLowerCase();
  });

  const getStatusBadge = (statut) => {
    const val = (statut || '').toLowerCase();
    if (val === 'traite' || val === 'traité') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Traité
        </span>
      );
    }
    if (val === 'urgent') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5" />
          Urgent
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3.5 h-3.5" />
        {statut || 'Arrivé'}
      </span>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-6 text-slate-800 relative">
      
      {/* CSS d'impression pour n'imprimer QUE la fiche A4 */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #fiche-a4-container, #fiche-a4-container * {
            visibility: visible;
          }
          #fiche-a4-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20mm;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Courriers Arrivés</h1>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-100">
              {courriers.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestion et consultation des fiches de courriers entrants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCourriers}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition cursor-pointer"
            title="Rafraîchir"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button 
            onClick={handleNouveauCourrier}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau courrier arrivé</span>
          </button>
        </div>
      </div>

      {/* Cartes de synthèse */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 no-print">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Total reçus</p>
            <p className="text-lg font-bold text-slate-900">{courriers.length}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">En traitement</p>
            <p className="text-lg font-bold text-slate-900">
              {courriers.filter(c => (c.statut || '').toLowerCase() !== 'traite').length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Traités</p>
            <p className="text-lg font-bold text-slate-900">
              {courriers.filter(c => (c.statut || '').toLowerCase() === 'traite').length}
            </p>
          </div>
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par N°, expéditeur ou objet..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          {['all', 'Arrivé', 'En cours', 'Traité'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterStatus === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'Tous' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl text-xs flex items-center justify-between no-print">
          <span>{error}</span>
          <button onClick={fetchCourriers} className="underline font-bold hover:text-rose-900">Réessayer</button>
        </div>
      )}

      {/* Tableau des courriers */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Réf.</th>
                <th className="py-3.5 px-4">Expéditeur</th>
                <th className="py-3.5 px-4">Objet</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold text-slate-600">Chargement des courriers...</p>
                  </td>
                </tr>
              ) : courriersFiltres.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">Aucun courrier trouvé</p>
                  </td>
                </tr>
              ) : (
                courriersFiltres.map((item, index) => {
                  const ref = item.reference || item.numero_ordre || `ENT-${item.id}`;
                  const expediteur = item.nom_expediteur || item.structure_expediteur || item.expediteur || 'Inconnu';
                  const dateStr = item.date || item.date_reception || item.created_at || '-';

                  return (
                    <tr 
                      key={item.id || index} 
                      onClick={() => setSelectedCourrier(item)}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-bold text-blue-700 whitespace-nowrap">
                        {ref}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 whitespace-nowrap max-w-xs truncate">
                        {expediteur}
                      </td>
                      <td className="py-3.5 px-4 max-w-sm truncate text-slate-600" title={item.objet}>
                        {item.objet || 'Sans objet'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getStatusBadge(item.statut)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCourrier(item);
                          }}
                          className="p-1.5 text-slate-400 group-hover:text-blue-600 group-hover:bg-white rounded-lg transition shadow-xs"
                          title="Voir la lettre / fiche A4"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FICHE FORMAT A4 (COURRIER PHYSIQUE SANS TRAITS NI GRILLES) */}
      {selectedCourrier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-center items-start p-4 sm:p-6">
          <div className="relative w-full max-w-4xl my-auto">
            
            {/* Barre d'action fixe au-dessus du document */}
            <div className="no-print bg-slate-900 text-white p-3 rounded-t-2xl flex items-center justify-between shadow-lg">
              <span className="text-xs font-semibold px-3 py-1 bg-slate-800 rounded-lg">
                Aperçu Courrier A4 - {selectedCourrier.reference || `ENT-${selectedCourrier.id}`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer le Courrier</span>
                </button>
                <button
                  onClick={() => setSelectedCourrier(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* FEUILLE A4 - MISE EN PAGE LETTRE ADMINISTRATIVE OFFICIELLE */}
            <div 
              id="fiche-a4-container"
              className="bg-white text-slate-900 p-12 sm:p-16 shadow-2xl rounded-b-2xl sm:rounded-b-none font-serif leading-relaxed text-sm space-y-8"
              style={{ minHeight: '297mm' }}
            >
              
              {/* En-tête : Expéditeur à gauche / Lieu et Date à droite */}
              <div className="flex justify-between items-start text-xs font-sans">
                {/* Bloc Expéditeur (Gauche) */}
                <div className="space-y-1">
                  <p className="font-bold text-base text-slate-900 uppercase tracking-wide">
                    {selectedCourrier.structure_expediteur || selectedCourrier.nom_expediteur || selectedCourrier.expediteur || 'Organisme Expéditeur'}
                  </p>
                  {selectedCourrier.nom_expediteur && selectedCourrier.structure_expediteur && (
                    <p className="text-slate-600 font-medium">
                      Par : {selectedCourrier.nom_expediteur}
                    </p>
                  )}
                  <p className="text-slate-500">Service de la Correspondance</p>
                  <p className="text-slate-500">N° Réf. : <span className="font-semibold text-slate-800">{selectedCourrier.reference || selectedCourrier.numero_ordre || `ENT-${selectedCourrier.id}`}</span></p>
                </div>

                {/* Bloc Date & Destinataire (Droite) */}
                <div className="text-right space-y-1">
                  <p className="text-slate-700 font-medium">
                    Reçu le : {selectedCourrier.date || selectedCourrier.date_reception || selectedCourrier.created_at || new Date().toLocaleDateString('fr-FR')}
                  </p>
                  <p className="text-slate-500 italic mt-4">À l'attention de l'Administration Centrale</p>
                </div>
              </div>

              {/* Objet de la lettre */}
              <div className="pt-6 font-sans">
                <p className="text-base font-bold text-slate-900">
                  <span className="underline uppercase tracking-wide">Objet :</span> {selectedCourrier.objet || 'Enregistrement de courrier entrant'}
                </p>
              </div>

              {/* Corps du courrier */}
              <div className="space-y-4 text-slate-800 text-justify font-sans leading-7 pt-2">
                <p>
                  Madame, Monsieur,
                </p>
                <p>
                  Par la présente, nous confirmons la réception et l'enregistrement officiel dans nos services du courrier transmis par <span className="font-semibold">{selectedCourrier.nom_expediteur || selectedCourrier.structure_expediteur || 'l\'expéditeur'}</span> en date du <span className="font-semibold">{selectedCourrier.date || selectedCourrier.date_reception || 'N/A'}</span>.
                </p>
                <p>
                  Ce document a été indexé sous la référence officielle <span className="font-semibold">{selectedCourrier.reference || selectedCourrier.numero_ordre || `ENT-${selectedCourrier.id}`}</span> et suit actuellement le parcours de traitement administratif sous le statut <span className="font-semibold capitalize">{selectedCourrier.statut || 'En cours'}</span>.
                </p>
              </div>

              {/* Section Pièces jointes / Fichiers numériques */}
              <div className="pt-4 font-sans text-xs space-y-2">
                <p className="font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-slate-600" />
                  Pièces Jointes & Fichiers Associés :
                </p>

                {selectedCourrier.fichier || selectedCourrier.chemin_fichier || selectedCourrier.piece_jointe ? (
                  <div className="pl-5 space-y-1 text-slate-600">
                    <p className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="font-mono text-slate-800">
                        {selectedCourrier.fichier || selectedCourrier.chemin_fichier || selectedCourrier.piece_jointe}
                      </span>
                      {selectedCourrier.fichier && (
                        <a
                          href={selectedCourrier.fichier}
                          target="_blank"
                          rel="noreferrer"
                          className="no-print inline-flex items-center gap-1 font-bold text-blue-700 hover:underline ml-2"
                        >
                          <Download className="w-3 h-3" />
                          Consulter
                        </a>
                      )}
                    </p>
                    <p className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Folder className="w-3 h-3 shrink-0" />
                      Chemin Serveur : /media/courriers/{selectedCourrier.reference || selectedCourrier.id}/document.pdf
                    </p>
                  </div>
                ) : (
                  <p className="pl-5 text-slate-400 italic">
                    Aucune pièce jointe ou document numérique rattaché à ce courrier.
                  </p>
                )}
              </div>

              {/* Zone d'Annotations & Signature */}
              <div className="pt-16 font-sans flex justify-between items-end">
                {/* Bloc Instructions */}
                <div className="w-1/2 space-y-2">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Instructions & Annotations :
                  </p>
                  <p className="text-xs text-slate-400 italic">
                    {selectedCourrier.annotation || 'Rien à signaler / Transmis pour attribution.'}
                  </p>
                </div>

                {/* Signature / Visa */}
                <div className="text-right space-y-12">
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Le Responsable du Courrier
                  </p>
                  <p className="text-[11px] text-slate-400 italic pt-8">
                    Signature & Cachet officiel
                  </p>
                </div>
              </div>

              {/* Pied de page du courrier */}
              <div className="pt-20 text-center font-sans text-[10px] text-slate-400 space-y-0.5">
                <p className="font-semibold uppercase">Services de la Gestion du Courrier & des Archives</p>
                <p>Document imprimé depuis l'application de gestion le {new Date().toLocaleDateString('fr-FR')}</p>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default EntrantPage;