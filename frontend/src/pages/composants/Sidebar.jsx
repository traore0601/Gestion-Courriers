import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import avatarImg from "../assets/heroo.jpeg";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";
import LogoutConfirmModal from "./LogoutConfirmModal.jsx";
import { 
  LayoutDashboard, 
  Inbox, 
  FileText, 
  Send, 
  Scan, 
  History, 
  Settings, 
  Archive, 
  Bell, 
  LogOut,
  HelpCircle,
  Users,
  ShieldCheck
} from 'lucide-react';

// Dictionnaire centralisé des menus par rôle pour une maintenabilité parfaite
const NAVIGATION_CONFIG = {
  SECRETAIRE: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard-secretaire' },
    { label: 'Courriers Entrant', icon: Inbox, path: "/courriers-entrant" },
    { label: 'Courriers Internes', icon: FileText, path: '/courriers-internes' },
    { label: 'Courriers Départs', icon: Send, path: '/courriers-departs' },
    { label: 'Archives Service', icon: Archive, path: '/editions' },
    { label: 'Numérisation', icon: Scan, path: '/numerisation' },
    { label: 'Historique', icon: History, path: '/historique' },
    { label: 'Notifications', icon: Bell, path: '/notifications' },
  ],
  SERVICE: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard-service' },
    { label: 'Boîte de Réception', icon: Inbox, path: '/boite-reception' },
    { label: 'Courriers Internes', icon: FileText, path: '/courriers-internes' },
    { label: 'Espace Collaborateurs', icon: Users, path: '/espace-collaborateurs' },
    { label: 'Suivi et Apports', icon: FileText, path: '/suivi-apports' },
    { label: 'Projet de Réponse', icon: Send, path: '/projet-reponse' },
    { label: 'Signature & Clôture', icon: ShieldCheck, path: '/signature-cloture' },
    { label: 'Paramètres', icon: Settings, path: '/parametres-service' },
  ],
  DG: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/direction-generale/dashboard' },
    { label: 'Courriers Reçus', icon: Inbox, path: '/direction-generale/courriers-recus' },
    { label: 'Tâches à Traiter', icon: FileText, path: '/direction-generale/tache' },
    { label: 'Envois', icon: Send, path: '/direction-generale/envoi' },
    { label: 'Archives', icon: Archive, path: '/direction-generale/archives' },
    { label: 'Notifications', icon: Bell, path: '/direction-generale/notifications' },
    { label: 'Paramètres', icon: Settings, path: '/direction-generale/parametres' },
  ]
};

const BOTTOM_NAV_ITEMS = [
  { label: 'Paramètres', icon: Settings, path: '/parametres' },
  { label: 'Aide & Support', icon: HelpCircle, path: '/aide' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Normalisation du rôle (gestion de l'alias DIRECTION -> DG si besoin)
  const rawRole = user?.role === 'DIRECTION' ? 'DG' : user?.role;
  const userRole = NAVIGATION_CONFIG[rawRole] ? rawRole : 'SECRETAIRE';

  const currentNavItems = NAVIGATION_CONFIG[userRole] || NAVIGATION_CONFIG.SECRETAIRE;

  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setLoggingOut(false);
      setLogoutModalOpen(false);
    }
  };

  const getLinkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white text-blue-700 shadow font-bold'
        : 'text-white hover:bg-blue-600/50 focus-visible:bg-blue-600/50 outline-none'
    }`;

  return (
    <aside className="w-64 h-screen bg-blue-700 text-white flex flex-col justify-between py-3 px-3 shadow-lg z-20 relative shrink-0 overflow-hidden">
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo et Badge du rôle professionnel */}
        <div className="flex flex-col items-center mb-2 shrink-0">
          <div className="border-2 border-white/20 p-1 rounded-lg bg-white/10 flex items-center justify-center w-14 h-14 overflow-hidden">
            <img src={avatarImg} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-[10px] uppercase tracking-wider bg-blue-800 px-2 py-0.5 rounded-full mt-1.5 text-blue-200 font-semibold">
            {userRole}
          </span>
        </div>

        {/* Navigation Principale Dynamique */}
        <nav aria-label="Navigation principale" className="space-y-0.5 flex-1 overflow-y-auto pr-1">
          {currentNavItems.map(({ label, icon: Icon, path }) => (
            <NavLink key={path} to={path} className={getLinkClass}>
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate flex-1">{label}</span>
              {label === 'Notifications' && unreadCount > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shrink-0">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Navigation Basse & Déconnexion */}
      <div className="pt-2 border-t border-blue-600/60 space-y-0.5 shrink-0">
        <nav aria-label="Navigation secondaire" className="space-y-0.5">
          {BOTTOM_NAV_ITEMS.map(({ label, icon: Icon, path }) => (
            <NavLink key={path} to={path} className={getLinkClass}>
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setLogoutModalOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-1.5 rounded-full text-sm font-medium text-white hover:bg-red-600/80 focus-visible:bg-red-600/80 outline-none transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Déconnexion</span>
        </button>
      </div>

      <LogoutConfirmModal
        open={logoutModalOpen}
        loading={loggingOut}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutModalOpen(false)}
      />
    </aside>
  );
};

export default Sidebar;