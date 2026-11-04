import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import avatarImg from "../assets/heroo.jpeg";
import { useAuth } from "../context/AuthContext.jsx";
import { authFetch } from "../api/apiClient.js";
import LogoutConfirmModal from "./LogoutConfirmModal.jsx";
import { 
  LayoutDashboard, 
  Inbox, 
  CheckSquare, 
  Send, 
  Archive, 
  Bell, 
  Search,
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

const SidebarService = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // État dynamique pour les compteurs
  const [counts, setCounts] = useState({
    courriers: 0,
    taches: 0,
    notifications: 0,
  });

  // Chargement dynamique des compteurs depuis l'API Django
  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const response = await authFetch('http://127.0.0.1:8000/api/dashboard/stats-destinataire/');
        if (response.ok) {
          const data = await response.json();
          setCounts({
            courriers: data.courriers_non_lus || 0,
            taches: data.taches_en_attente || 0,
            notifications: data.notifications_non_lues || 0,
          });
        }
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques du menu :", err);
      }
    };

    fetchCounters();
    const interval = setInterval(fetchCounters, 30000);
    return () => clearInterval(interval);
  }, []);

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
    `w-full flex items-center justify-between px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white text-blue-700 shadow font-bold'
        : 'text-white hover:bg-blue-600/50 focus-visible:bg-blue-600/50 outline-none'
    }`;

  // Liste des menus avec IDs uniques et routes cohérentes
  const MAIN_NAV_ITEMS = [
    { id: 'inbox', label: 'Boite de Reception', icon: Inbox, path: '/courriers-recus', badge: counts.courriers },
    { id: 'dashboard', label: 'Planification', icon: LayoutDashboard, path: '/dashboard-service' },
    { id: 'collaborateurs', label: 'Espace Collaborateurs', icon: CheckSquare, path: '/espace-collaborateurs', badge: counts.taches },
    { id: 'suivi', label: 'Suivi et Apports', icon: Send, path: '/suivi-apports' },
    { id: 'reponse', label: 'Projet de Réponse', icon: Archive, path: '/projet-reponse' },
    { id: 'signature', label: 'Signature et Clôture', icon: Bell, path: '/signature-cloture', badge: counts.notifications },
    { id: 'recherche', label: 'Recherche Multicritere', icon: Search, path: '/recherche-multicritere' },
  ];

  const BOTTOM_NAV_ITEMS = [
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/parametres-service' },
    { id: 'help', label: 'Aide & Support', icon: HelpCircle, path: '/aide-service' },
  ];

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
        {MAIN_NAV_ITEMS.map(({ id, label, icon: Icon, path, badge }) => (
          <NavLink
            key={id}
            to={path}
            className={getLinkClass}
          >
            <div className="flex items-center gap-3 truncate">
              <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{label}</span>
            </div>
            {badge > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 animate-pulse">
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="pt-2 border-t border-blue-600/60 space-y-1 mt-2 shrink-0">
        <nav aria-label="Navigation secondaire" className="space-y-1">
          {BOTTOM_NAV_ITEMS.map(({ id, label, icon: Icon, path }) => (
            <NavLink
              key={id}
              to={path}
              className={getLinkClass}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{label}</span>
              </div>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setLogoutModalOpen(true)}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-full text-sm font-medium text-white hover:bg-red-600/80 focus-visible:bg-red-600/80 outline-none transition-colors cursor-pointer"
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

export default SidebarService;