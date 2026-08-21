import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Info, 
  Check, 
  Trash2, 
  Inbox 
} from 'lucide-react';

// Configuration des styles et icônes selon le type d'alerte
const NOTIFICATION_TYPES = {
  WARNING: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    titleColor: 'text-amber-900',
    textColor: 'text-amber-700',
    iconColor: 'text-amber-600',
    badge: 'Urgent'
  },
  DELAY: {
    icon: Clock,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    titleColor: 'text-red-900',
    textColor: 'text-red-700',
    iconColor: 'text-red-600',
    badge: 'Retard'
  },
  INFO: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    titleColor: 'text-blue-900',
    textColor: 'text-blue-700',
    iconColor: 'text-blue-600',
    badge: 'Information'
  },
  SUCCESS: {
    icon: CheckCircle2,
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-500',
    titleColor: 'text-emerald-900',
    textColor: 'text-emerald-700',
    iconColor: 'text-emerald-600',
    badge: 'Succès'
  }
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    type: 'WARNING',
    title: 'Délai de réponse bientôt dépassé',
    message: 'Le courrier "Rapport d\'activité" requiert une réponse avant demain.',
    time: "Il y a 30 min",
    isRead: false
  },
  {
    id: 2,
    type: 'DELAY',
    title: 'Courrier en souffrance',
    message: 'Le courrier N° 2026-089 à destination de la comptabilité accuse un retard de 48h.',
    time: 'Hier, 14:20',
    isRead: false
  },
  {
    id: 3,
    type: 'SUCCESS',
    title: 'Transmission confirmée',
    message: 'Le bordereau de transmission N° FT-104 a été validé avec succès par le destinataire.',
    time: '17/08/2026',
    isRead: true
  }
];

function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="w-full space-y-5">
      {/* En-tête avec compteur et action globale */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
              {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="self-start sm:self-auto text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-blue-600" />
            <span>Tout marquer comme lu</span>
          </button>
        )}
      </div>

      {/* Liste des notifications */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 space-y-2">
          <Inbox className="w-8 h-8 mx-auto text-gray-300" />
          <p className="text-xs">Aucune notification pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((item) => {
            const config = NOTIFICATION_TYPES[item.type] || NOTIFICATION_TYPES.INFO;
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className={`border-l-4 ${config.borderColor} p-4 rounded-r-xl transition-all flex items-start justify-between gap-3 ${
                  item.isRead ? 'bg-gray-50/70 border-gray-300 opacity-75' : `${config.bgColor} shadow-sm`
                }`}
              >
                <div className="flex items-start space-x-3 min-w-0">
                  <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${item.isRead ? 'text-gray-400' : config.iconColor}`} />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-semibold ${item.isRead ? 'text-gray-700' : config.titleColor}`}>
                        {item.title}
                      </p>
                      {!item.isRead && (
                        <span className={`text-[10px] px-2 py-0.2 rounded font-medium bg-white/80 border border-gray-200 ${config.textColor}`}>
                          {config.badge}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed ${item.isRead ? 'text-gray-500' : config.textColor}`}>
                      {item.message}
                    </p>
                    <span className="text-[10px] text-gray-400 block font-medium">
                      {item.time}
                    </span>
                  </div>
                </div>

                {/* Actions individuelles */}
                <div className="flex items-center gap-1 shrink-0">
                  {!item.isRead && (
                    <button
                      onClick={() => markAsRead(item.id)}
                      title="Marquer comme lu"
                      className="p-1.5 hover:bg-white/60 text-gray-500 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(item.id)}
                    title="Supprimer"
                    className="p-1.5 hover:bg-white/60 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Notifications;