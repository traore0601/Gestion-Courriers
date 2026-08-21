import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Mail, 
  Send, 
  FileText, 
  AlertCircle, 
  ArrowUpRight, 
  Inbox, 
  Layers, 
  TrendingUp, 
  RefreshCw,
  ChevronRight,
  Eye
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  CartesianGrid
} from 'recharts';

// Composant Custom Tooltip pour Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-800">
        <p className="font-semibold text-slate-300 mb-1">{label}</p>
        <p className="font-bold text-blue-400">
          {payload[0].name || 'Total'} : <span className="text-white">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const navigate = useNavigate();

  const [courriersEntrants, setCourriersEntrants] = useState([]);
  const [loading, setLoading] = useState(true);

  const STATUT_CONFIG = {
    arrive: { label: 'Arrivé', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    a_assigner: { label: 'À assigner', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
    transmis: { label: 'Transmis', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    en_cours: { label: 'En cours', bg: 'bg-orange-50 text-orange-700 border-orange-200' },
    en_attente: { label: 'En attente', bg: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    traite: { label: 'Traité', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    archive: { label: 'Archivé', bg: 'bg-slate-100 text-slate-600 border-slate-200' },
  };

  const fetchCourriers = () => {
    setLoading(true);
    fetch('http://127.0.0.1:8000/api/courriers-entrants/')
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.results || []);
        setCourriersEntrants(list);
      })
      .catch((err) => console.error("Erreur API Django :", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCourriers();
  }, []);

  const totalEntrants = courriersEntrants.length;

  // Traitement par mois
  const moisNoms = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  const countsParMois = Array(12).fill(0);

  courriersEntrants.forEach((item) => {
    const dateStr = item.date || item.date_reception || item.created_at; 
    if (dateStr) {
      let moisNum = null;
      if (dateStr.includes('-')) {
        const parts = dateStr.split('-');
        if (parts.length >= 2) moisNum = parseInt(parts[1], 10);
      } else if (dateStr.includes('/')) {
        const parts = dateStr.split('/');
        if (parts.length >= 2) moisNum = parseInt(parts[1], 10);
      }
      if (moisNum && moisNum >= 1 && moisNum <= 12) {
        countsParMois[moisNum - 1] += 1;
      }
    }
  });

  const dataCourriersMois = moisNoms.map((nom, index) => ({
    name: nom,
    Courriers: countsParMois[index],
  }));

  const dataPieType = [
    { name: 'Entrants', value: totalEntrants || 1, color: '#2563EB' },
    { name: 'Sortants', value: 0, color: '#E11D48' },
    { name: 'Internes', value: 0, color: '#10B981' },
  ];

  const dataServices = [
    { name: 'IT', count: totalEntrants },
    { name: 'Compta', count: 0 },
    { name: 'RH', count: 0 },
    { name: 'Finance', count: 0 },
    { name: 'Ventes', count: 0 },
    { name: 'Direction', count: 0 },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-6 text-slate-800 bg-slate-50/50 min-h-screen">
      
      {/* En-tête du Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tableau de bord</h1>
          <p className="text-xs text-slate-500 mt-1">
            Vue d'ensemble et statistiques de la gestion du courrier.
          </p>
        </div>
        <button
          onClick={fetchCourriers}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* 1. CARTES SUPERIEURES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total General */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Général</span>
            <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{totalEntrants}</span>
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> Actif
            </span>
          </div>
        </div>

        {/* Courriers Entrants */}
        <div 
          onClick={() => navigate('/liste-courrier-entrant')}
          className="bg-gradient-to-br from-blue-600 to-blue-700 p-5 rounded-2xl shadow-md text-white flex flex-col justify-between cursor-pointer hover:scale-[1.01] transition duration-200 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">Courriers Entrants</span>
            <div className="p-2 bg-white/20 text-white rounded-xl backdrop-blur-md group-hover:bg-white group-hover:text-blue-600 transition">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold">{loading ? '...' : totalEntrants}</span>
            <span className="text-xs text-blue-100 flex items-center gap-1 group-hover:underline">
              Voir la liste <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Courriers Sortants */}
        <div 
          onClick={() => navigate('/courriers-departs')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Courriers Sortants</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-100 transition">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">0</span>
            <span className="text-[11px] font-medium text-slate-400">Départs</span>
          </div>
        </div>

        {/* Courriers Internes */}
        <div 
          onClick={() => navigate('/liste-courriers-internes')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Courriers Internes</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-100 transition">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">0</span>
            <span className="text-[11px] font-medium text-slate-400">Interne</span>
          </div>
        </div>

      </div>

      {/* 2. SECTION GRAPHIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Histogramme Activité */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Activité Mensuelle</h3>
              <p className="text-xs text-slate-400">Volume de courriers reçus par mois</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">2026</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataCourriersMois} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Courriers" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Camembert Répartition & Statut rapide */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Répartition par Type</h3>
              <span className="text-xs font-medium text-slate-400">Global</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="h-40 w-40 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={dataPieType.filter(d => d.value > 0)} 
                      innerRadius="65%" 
                      outerRadius="90%" 
                      paddingAngle={3} 
                      dataKey="value"
                    >
                      {dataPieType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} cornerRadius={4} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-xl font-bold text-slate-900">{totalEntrants}</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">Total</span>
                </div>
              </div>

              {/* Légende */}
              <div className="space-y-3 text-xs font-medium pr-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
                  <span className="text-slate-600">Entrants</span>
                  <span className="font-bold text-slate-900 ml-auto">{totalEntrants}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
                  <span className="text-slate-600">Sortants</span>
                  <span className="font-bold text-slate-900 ml-auto">0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-slate-600">Internes</span>
                  <span className="font-bold text-slate-900 ml-auto">0</span>
                </div>
              </div>
            </div>

            {/* Micro indicateurs */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
              <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100 text-center">
                <p className="text-[10px] font-bold text-rose-600">Urgents</p>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">0</p>
              </div>
              <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 text-center">
                <p className="text-[10px] font-bold text-blue-600">En Retard</p>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">0</p>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100 text-center">
                <p className="text-[10px] font-bold text-amber-600">Non Lus</p>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">{totalEntrants}</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. TABLEAU & SERVICES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Derniers courriers */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Derniers Courriers Entrants</h3>
                <p className="text-xs text-slate-400">Récemment enregistrés dans le système</p>
              </div>
              <button 
                onClick={() => navigate('/liste-courrier-entrant')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
              >
                <span>Tout afficher</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 px-2">Réf.</th>
                    <th className="pb-3 px-2">Expéditeur</th>
                    <th className="pb-3 px-2">Objet</th>
                    <th className="pb-3 px-2">Date</th>
                    <th className="pb-3 px-2">Statut</th>
                    <th className="pb-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        Chargement des données...
                      </td>
                    </tr>
                  ) : courriersEntrants.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400 italic">
                        Aucun courrier entrant enregistré.
                      </td>
                    </tr>
                  ) : (
                    courriersEntrants.slice(0, 4).map((item, index) => {
                      const keyStatut = (item.statut || 'arrive').toLowerCase().replace(' ', '_');
                      const statutInfo = STATUT_CONFIG[keyStatut] || { 
                        label: item.statut || 'Arrivé', 
                        bg: 'bg-blue-50 text-blue-700 border-blue-200' 
                      };

                      return (
                        <tr key={item.id || index} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-2 font-semibold text-blue-600 whitespace-nowrap">
                            {item.reference || item.numero_ordre || `ENT-${item.id}`}
                          </td>
                          <td className="py-3 px-2 font-medium text-slate-900 whitespace-nowrap max-w-[130px] truncate">
                            {item.nom_expediteur || item.structure_expediteur || 'Inconnu'}
                          </td>
                          <td className="py-3 px-2 max-w-[180px] truncate text-slate-500" title={item.objet}>
                            {item.objet || 'Sans objet'}
                          </td>
                          <td className="py-3 px-2 whitespace-nowrap text-slate-400">
                            {item.date || item.date_reception || '-'}
                          </td>
                          <td className="py-3 px-2 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${statutInfo.bg}`}>
                              {statutInfo.label}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right whitespace-nowrap">
                            <button 
                              onClick={() => navigate(`/courriers-arrives/${item.id}`)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Consulter"
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
        </div>

        {/* Ventilation par Service */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Courriers par Service</h3>
            <p className="text-xs text-slate-400 mb-4">Affectation selon les départements</p>
            
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataServices} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} width={60} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;