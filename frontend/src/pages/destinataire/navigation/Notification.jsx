import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  FileText, 
  Trash2, 
  CheckCheck, 
  ChevronRight,
  Loader2,
  RefreshCw
} from 'lucide-react';

// Import direct correspondant exactement aux exports de votre apiClient.js
// Remplacez 'deleteNotificationApi' par 'deleteNotificationRequest'
import { 
  fetchNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotificationRequest 
} from '/src/pages/api/apiClient';

export default function NotificationDG() {
  const [notifications, setNotifications] = useState([]);
  const [filtreType, setFiltreType] = useState('Tous');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. CHARGEMENT INITIAL DES NOTIFICATIONS
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotifications(); 
      setNotifications(data);
    } catch (err) {
      console.error("Erreur de chargement :", err);
      setError(err.message || "Impossible de charger les notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // 2. FILTRAGE LOCAL
  const notificationsFiltrees = notifications.filter((item) => {
    if (filtreType === 'Non_lus') return !item.lu;
    if (filtreType === 'Urgents') return item.type === 'Urgent' || item.type === 'Confidentiel';
    return true;
  });

  const nonLusCount = notifications.filter(n => !n.lu).length;

  // 3. TOUT MARQUER COMME LU
  const handleMarkAllAsRead = async () => {
    const backup = [...notifications];
    setNotifications(prev => prev.map(n => ({ ...n, lu: true })));

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error("Erreur serveur :", err);
      setNotifications(backup); // Restauration en cas d'échec
    }
  };

  // 4. BASCIULER ÉTAT LU / NON LU
  const handleToggleRead = async (item) => {
    // Si la notification est déjà lue, on ne ré-exécute pas le mark_read POST
    if (item.lu) return;

    const backup = [...notifications];
    setNotifications(prev => prev.map(n => 
      n.id === item.id ? { ...n, lu: true } : n
    ));

    try {
      await markNotificationAsRead(item.id);
    } catch (err) {
      console.error("Erreur serveur :", err);
      setNotifications(backup);
    }
  };

  // 5. SUPPRIMER UNE NOTIFICATION
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    const backup = [...notifications];

    setNotifications(prev => prev.filter(n => n.id !== id));

    try {
      await deleteNotificationRequest(id);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      setNotifications(backup);
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-2xl flex flex-col overflow-hidden font-sans">
      
      {/* EN-TÊTE */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-xl relative">
            <Bell size={20} />
            {nonLusCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {nonLusCount}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Notifications & Alertes DG</h2>
            <p className="text-xs text-slate-500">{nonLusCount} notification(s) non lue(s)</p>
          </div>
        </div>

        {/* ACTIONS GLOBALES */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadNotifications}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            title="Rafraîchir"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </button>

          {nonLusCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
            >
              <CheckCheck size={14} /> Tout marquer comme lu
            </button>
          )}
        </div>
      </div>

      {/* FILTRES RAPIDES */}
      <div className="px-4 py-2.5 bg-slate-100/80 border-b border-slate-200 flex gap-2 text-xs font-medium">
        <button
          onClick={() => setFiltreType('Tous')}
          className={`px-3 py-1 rounded-lg transition ${
            filtreType === 'Tous' ? 'bg-slate-900 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-200'
          }`}
        >
          Toutes ({notifications.length})
        </button>
        <button
          onClick={() => setFiltreType('Non_lus')}
          className={`px-3 py-1 rounded-lg transition ${
            filtreType === 'Non_lus' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-white text-slate-600 hover:bg-slate-200'
          }`}
        >
          Non lues ({nonLusCount})
        </button>
        <button
          onClick={() => setFiltreType('Urgents')}
          className={`px-3 py-1 rounded-lg transition ${
            filtreType === 'Urgents' ? 'bg-red-600 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-200'
          }`}
        >
          Urgentes & Confidentielles
        </button>
      </div>

      {/* LISTE DES NOTIFICATIONS */}
      <div className="flex-1 overflow-y-auto bg-white divide-y divide-slate-100 p-2 space-y-1">
        
        {loading && (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Loader2 size={24} className="animate-spin text-amber-500" />
            <span className="text-xs">Chargement des notifications...</span>
          </div>
        )}

        {!loading && error && (
          <div className="p-6 text-center text-xs text-red-500 bg-red-50 rounded-xl m-2 border border-red-100">
            <p className="font-semibold mb-2">{error}</p>
            <button 
              onClick={loadNotifications}
              className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-bold transition"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && notificationsFiltrees.length > 0 && (
          notificationsFiltrees.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleRead(item)}
              className={`p-3.5 rounded-xl cursor-pointer transition flex items-start justify-between gap-3 border ${
                !item.lu 
                  ? 'bg-amber-50/50 border-amber-200/80' 
                  : 'bg-white border-transparent hover:bg-slate-50'
              }`}
            >
              <div className="mt-0.5">
                {item.type === 'Urgent' && (
                  <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                    <AlertTriangle size={16} />
                  </div>
                )}
                {item.type === 'Confidentiel' && (
                  <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                    <ShieldAlert size={16} />
                  </div>
                )}
                {item.type === 'Validation' && (
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                    <FileText size={16} />
                  </div>
                )}
                {item.type === 'Rappel' && (
                  <div className="p-2 bg-slate-100 text-slate-700 rounded-lg">
                    <Clock size={16} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className={`text-xs ${!item.lu ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                    {item.titre || item.title}
                  </h4>
                  {(item.reference || item.ref) && (
                    <span className="text-[10px] font-mono text-slate-400 font-semibold">
                      {item.reference || item.ref}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-1.5">{item.message}</p>
                <span className="text-[10px] text-slate-400 font-medium">
                  {item.date || item.created_at}
                </span>
              </div>

              <div className="flex items-center gap-1.5 self-center">
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                  title="Supprimer la notification"
                >
                  <Trash2 size={15} />
                </button>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            </div>
          ))
        )}

        {!loading && !error && notificationsFiltrees.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400">
            Aucune notification à afficher.
          </div>
        )}
      </div>

    </div>
  );
}