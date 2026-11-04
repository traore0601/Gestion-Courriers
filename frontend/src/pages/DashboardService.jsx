import React, { useEffect, useState } from 'react';
import { Mail, FileText, Download, Calendar, Inbox, Clock, CheckCircle2, AlertTriangle, Bell, Loader2 } from 'lucide-react';
import { 
  fetchDashboardStatsDestinataire, 
  fetchCourriersDestinataire, 
  updateStatutCourrier,
  API_BASE_URL 
} from './api/apiClient.js';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-4.5 h-4.5 text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-lg font-bold text-slate-800 leading-tight">{value ?? '—'}</p>
      <p className="text-[11px] text-slate-500 truncate">{label}</p>
    </div>
  </div>
);

const DashbordService = () => {
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [courriers, setCourriers] = useState([]);
  const [courriersLoading, setCourriersLoading] = useState(true);
  const [filter, setFilter] = useState('Tout');

  // Chargement des statistiques et des courriers
  const loadData = async () => {
    try {
      const [statsData, courriersData] = await Promise.all([
        fetchDashboardStatsDestinataire().catch(err => {
          console.error('Erreur stats:', err);
          return null;
        }),
        fetchCourriersDestinataire().catch(err => {
          console.error('Erreur courriers:', err);
          return [];
        })
      ]);

      setStats(statsData);
      setCourriers(courriersData);
    } finally {
      setStatsLoading(false);
      setCourriersLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const init = async () => {
      if (isMounted) await loadData();
    };
    
    init();

    // Polling toutes les 30 secondes
    const interval = setInterval(() => {
      if (isMounted) loadData();
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getBadgePriorite = (p) => {
    switch (p?.toUpperCase()) {
      case 'CRITIQUE':
        return 'bg-red-600 text-white';
      case 'HAUTE':
      case 'URGENT':
        return 'bg-amber-600 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  // Modification dynamique du statut vers Django
  const handleStatutChange = async (id, newStatut) => {
    try {
      // Mise à jour optimiste dans l'UI
      setCourriers(prev => 
        prev.map(c => c.id === id ? { ...c, statut: newStatut } : c)
      );

      // Envoi au serveur Django
      await updateStatutCourrier(id, newStatut);
      
      // Rafraîchir les stats après modification
      const updatedStats = await fetchDashboardStatsDestinataire();
      setStats(updatedStats);
    } catch (err) {
      console.error('Erreur lors du changement de statut :', err);
      // Recharger pour rétablir l'état réel en cas d'erreur
      loadData();
    }
  };

  // Filtrage local
  const filteredCourriers = courriers.filter(c => {
    if (filter === 'Tout') return true;
    if (filter === 'Urgent') return c.priorite === 'CRITIQUE' || c.priorite === 'HAUTE';
    if (filter === 'En cours') return c.statut === 'En cours' || c.statut === 'Pris en charge';
    if (filter === 'À traiter') return c.statut === 'En attente' || c.statut === 'En attente de prise en charge';
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Cartes de statistiques dynamiques */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          icon={Inbox}
          label="Courriers reçus"
          value={statsLoading ? '…' : stats?.recus}
          color="bg-blue-600"
        />
        <StatCard
          icon={Clock}
          label="En cours"
          value={statsLoading ? '…' : stats?.en_cours}
          color="bg-amber-500"
        />
        <StatCard
          icon={CheckCircle2}
          label="Traités"
          value={statsLoading ? '…' : stats?.traites}
          color="bg-emerald-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="Délais dépassés"
          value={statsLoading ? '…' : stats?.delais_depasses}
          color="bg-red-600"
        />
        <StatCard
          icon={Bell}
          label="Notifications non lues"
          value={statsLoading ? '…' : stats?.notifications_non_lues}
          color="bg-purple-600"
        />
      </div>

      <main className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-800 mb-2">
            Courriers Reçus de l'Accueil
          </h2>
          <div className="flex space-x-3 text-xs">
            {['Tout', 'Urgent', 'En cours', 'À traiter'].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`font-semibold transition ${
                  filter === item 
                    ? 'text-red-600 border-b-2 border-red-600 pb-0.5' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                [{item}]
              </button>
            ))}
          </div>
        </div>

        {/* Tableau connecté aux données Django */}
        <div className="flex-1 overflow-y-auto">
          {courriersLoading ? (
            <div className="p-8 flex items-center justify-center gap-2 text-slate-500 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              Chargement des courriers…
            </div>
          ) : filteredCourriers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Aucun courrier trouvé.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold sticky top-0">
                <tr>
                  <th className="p-3">Date d'Arrivée (et Heure)</th>
                  <th className="p-3">Expéditeur d'Origine</th>
                  <th className="p-3">Objet</th>
                  <th className="p-3">Référence</th>
                  <th className="p-3">Priorité</th>
                  <th className="p-3">Pièce Jointe</th>
                  <th className="p-3">Statut / Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCourriers.map((c) => {
                  const fichierUrl = c.fichier?.startsWith('http') 
                    ? c.fichier 
                    : `${API_BASE_URL}${c.fichier}`;

                  return (
                    <tr key={c.id || c.reference} className="hover:bg-slate-50 transition">
                      <td className="p-3 whitespace-nowrap text-slate-600 flex items-center gap-1.5">
                        {c.date || c.created_at} <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      </td>
                      <td className="p-3 font-medium text-slate-800">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {c.expediteur || c.expediteur_nom}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">{c.objet}</td>
                      <td className="p-3 text-slate-600 font-mono text-[11px]">{c.reference || c.id}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getBadgePriorite(c.priorite)}`}>
                          {c.priorite || 'NORMAL'}
                        </span>
                      </td>
                      <td className="p-3">
                        {c.fichier ? (
                          <a 
                            href={fichierUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>[PDF]</span>
                            <Download className="w-3 h-3 text-slate-500 ml-1" />
                          </a>
                        ) : (
                          <span className="text-slate-400 font-italic text-[11px]">Aucun</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="block text-[11px] text-slate-500 mb-1 font-medium">{c.statut}</span>
                        {c.statut !== 'Pris en charge' && c.statut !== 'Traité' && (
                          <button 
                            onClick={() => handleStatutChange(c.id, 'Pris en charge')}
                            className="px-2.5 py-1 bg-slate-200 border border-slate-300 rounded text-slate-800 hover:bg-slate-300 font-medium text-[11px] transition"
                          >
                            Prendre en charge
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashbordService;