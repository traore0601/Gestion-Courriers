import React, { useState, useEffect } from 'react';
import { 
  FilePlus, 
  Send, 
  CheckCircle, 
  FileText, 
  Trash2, 
  Search, 
  Filter, 
  Loader2, 
  Clock 
} from 'lucide-react';

// Configuration des icônes et couleurs par type d'action
const ACTION_CONFIG = {
  CREATION: {
    label: 'Création',
    icon: FilePlus,
    badgeClass: 'bg-green-50 text-green-700 border-green-200',
    iconClass: 'bg-green-100 text-green-600'
  },
  TRANSMISSION: {
    label: 'Transmission',
    icon: Send,
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    iconClass: 'bg-blue-100 text-blue-600'
  },
  VALIDATION: {
    label: 'Validation',
    icon: CheckCircle,
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    iconClass: 'bg-purple-100 text-purple-600'
  },
  MODIFICATION: {
    label: 'Modification',
    icon: FileText,
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    iconClass: 'bg-amber-100 text-amber-600'
  },
  SUPPRESSION: {
    label: 'Suppression',
    icon: Trash2,
    badgeClass: 'bg-red-50 text-red-700 border-red-200',
    iconClass: 'bg-red-100 text-red-600'
  }
};

// Données initiales / simulées
const INITIAL_LOGS = [
  {
    id: 1,
    actionType: 'CREATION',
    description: 'Enregistrement du courrier N° 2026-001',
    user: 'Marie-Noelle Ester',
    timestamp: "Aujourd'hui, 09:45"
  },
  {
    id: 2,
    actionType: 'TRANSMISSION',
    description: 'Transmission du courrier N° 2025-899 à la comptabilité',
    user: 'Kouassi Jean',
    timestamp: 'Hier, 16:30'
  },
  {
    id: 3,
    actionType: 'VALIDATION',
    description: 'Validation de la fiche de transmission N° FT-042',
    user: 'Directeur Général',
    timestamp: 'Hier, 14:15'
  },
  {
    id: 4,
    actionType: 'MODIFICATION',
    description: 'Mise à jour de l\'objet du courrier N° 2026-002',
    user: 'Marie-Noelle Ester',
    timestamp: '15/08/2026, 11:20'
  }
];

function Historique() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);

  // Simulation de chargement API (à remplacer par votre véritable useEffect)
  const refreshLogs = async () => {
    setIsLoading(true);
    try {
      // Exemple API: const res = await api.get('/logs/');
      // setLogs(res.data);
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (error) {
      console.error("Erreur lors de la récupération des journaux:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrage dynamique
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'ALL' || log.actionType === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full space-y-5">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Historique & Journal d'activités</h1>
          <p className="text-sm text-gray-500">Suivi des actions et de la traçabilité des courriers.</p>
        </div>

        <button
          onClick={refreshLogs}
          disabled={isLoading}
          className="self-start sm:self-auto px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-2 shadow-sm disabled:opacity-50 transition-colors"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-500" /> : <Clock className="w-3.5 h-3.5 text-gray-500" />}
          <span>Actualiser</span>
        </button>
      </div>

      {/* Barre de Filtres et Recherche */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
        {/* Recherche */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher par courrier, utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Filtres par type */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0 hidden sm:block" />
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
              selectedFilter === 'ALL'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          {Object.keys(ACTION_CONFIG).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                selectedFilter === key
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {ACTION_CONFIG[key].label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste du journal */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-xs">Chargement de l'historique...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-xs">
            Aucun événement ne correspond à vos critères.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredLogs.map((log) => {
              const config = ACTION_CONFIG[log.actionType] || ACTION_CONFIG.CREATION;
              const Icon = config.icon;

              return (
                <li key={log.id} className="p-4 hover:bg-gray-50/80 transition-colors flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-lg shrink-0 ${config.iconClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {log.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-500 font-normal">
                          par <strong className="font-semibold text-gray-700">{log.user}</strong>
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${config.badgeClass}`}>
                          {config.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-gray-400 font-medium shrink-0">
                    {log.timestamp}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Historique;