import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import avatarImg from "../assets/heroo.jpeg";
import { useAuth } from "../context/AuthContext.jsx";
import LogoutConfirmModal from "./LogoutConfirmModal.jsx";
import { 
  LayoutDashboard, 
  Inbox, 
  CheckSquare, 
  Send, 
  Archive, 
  Bell, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

// Mêmes préfixes /direction-generale/... que dans AppRoutes.jsx
const MAIN_NAV_ITEMS = [
  { label: 'Tableau de bord', icon: LayoutDashboard, path: '/direction-generale/dashboard' },
  { label: 'Courriers Reçus', icon: Inbox, path: '/direction-generale/courriers-recus' },
  { label: 'Tâches à Traiter', icon: CheckSquare, path: '/direction-generale/tache' },
  { label: 'Mes Envois', icon: Send, path: '/direction-generale/envoi' },
  { label: 'Archives Service', icon: Archive, path: '/direction-generale/archives' },
  { label: 'Notifications', icon: Bell, path: '/direction-generale/notifications' },
];

const BOTTOM_NAV_ITEMS = [
  { label: 'Paramètres', icon: Settings, path: '/direction-generale/parametres' },
  { label: 'Aide & Support', icon: HelpCircle, path: '/direction-generale/aide' },
];

const SidebarDG = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
    `w-full flex items-center gap-4 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white text-blue-700 shadow font-bold'
        : 'text-white hover:bg-blue-600/50 focus-visible:bg-blue-600/50 outline-none'
    }`;

  return (
    <aside className="w-64 h-screen bg-blue-700 text-white flex flex-col py-3 px-3 shadow-lg z-20 relative shrink-0 overflow-hidden">
      <div className="flex flex-col items-center mb-3 shrink-0">
        <div className="border-2 border-white/20 p-1 rounded-lg bg-white/10 flex items-center justify-center w-20 h-20 overflow-hidden">
          <img 
            src={avatarImg} 
            alt="Logo" 
            className="w-full h-full object-contain" 
          />
        </div>
      </div>

      <nav aria-label="Navigation principale" className="space-y-1 overflow-y-auto flex-1 pr-1">
        {MAIN_NAV_ITEMS.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={getLinkClass}
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="pt-2 border-t border-blue-600/60 space-y-1 mt-2 shrink-0">
        <nav aria-label="Navigation secondaire" className="space-y-1">
          {BOTTOM_NAV_ITEMS.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              className={getLinkClass}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setLogoutModalOpen(true)}
          className="w-full flex items-center gap-4 px-3.5 py-2 rounded-full text-sm font-medium text-white hover:bg-red-600/80 focus-visible:bg-red-600/80 outline-none transition-colors cursor-pointer"
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

export default SidebarDG;