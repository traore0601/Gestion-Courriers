import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import avatarImg from "../assets/heroo.jpeg";
import { 
  LayoutDashboard, 
  Inbox, 
  FileText, 
  Send, 
  Printer, 
  Scan, 
  History, 
  Settings, 
  Bell, 
  LogOut,
  HelpCircle
} from 'lucide-react';

const MAIN_NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Courriers Arrivés', icon: Inbox, path: '/entrant' },
  { label: 'Courriers Internes', icon: FileText, path: '/courriers-internes' },
  { label: 'Courriers Départs', icon: Send, path: '/courriers-departs' },
  { label: 'Éditions', icon: Printer, path: '/editions' },
  { label: 'Numérisation', icon: Scan, path: '/numerisation' },
  { label: 'Historique', icon: History, path: '/historique' },
  { label: 'Notifications', icon: Bell, path: '/notifications' },
];

const BOTTOM_NAV_ITEMS = [
  { label: 'Paramètres', icon: Settings, path: '/parametres' },
  { label: 'Aide & Support', icon: HelpCircle, path: '/aide' },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login', { replace: true }); 
  };

  const getLinkClass = ({ isActive }) =>
    `w-full flex items-center gap-7 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white text-blue-700 shadow font-bold'
        : 'text-white hover:bg-blue-600/50 focus-visible:bg-blue-600/50 outline-none'
    }`;

  return (
    <aside className="w-64 h-screen bg-blue-700 text-white flex flex-col py-3 px-3 shadow-lg z-20 relative shrink-0 overflow-hidden">
      {/* Logo réduis en hauteur (w-16 h-16) pour libérer immédiatement de la place */}
      <div className="flex flex-col items-center mb-3 shrink-0">
        <div className="border-2 border-white/20 p-1 rounded-lg bg-white/10 flex items-center justify-center w-23 h-23 overflow-hidden">
          <img 
            src={avatarImg} 
            alt="Logo" 
            className="w-full h-full object-contain" 
          />
        </div>
      </div>

      {/* Navigation Principale avec défilement fluide si l'écran est petit */}
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

      {/* Navigation Basse & Déconnexion poussées tout en bas */}
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

        {/* Bouton de Déconnexion */}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-full text-sm font-medium text-white hover:bg-red-600/80 focus-visible:bg-red-600/80 outline-none transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;