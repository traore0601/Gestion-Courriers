import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import avatarImg from "../assets/heroo.jpeg";
import { useAuth } from "../context/AuthContext.jsx";
import LogoutConfirmModal from "./LogoutConfirmModal.jsx";
import { 
  LayoutDashboard, 
  Inbox, 
  FileText, 
  Send, 
  Printer, 
  Scan, 
  History, 
  Bell, 
  Settings,
  LogOut,
  CheckSquare,
  Archive,
  FileCheck,
  Forward,
  BarChart3,
  Users,
  Building2,
  ShieldCheck,
  FolderKanban,
  Activity,
  Database
} from 'lucide-react';

const NAV_ITEMS_BY_ROLE = {
  secretaire: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Courriers Arrivés', icon: Inbox, path: '/entrant' },
    { label: 'Courriers Internes', icon: FileText, path: '/courriers-internes' },
    { label: 'Courriers Départs', icon: Send, path: '/courriers-departs' },
    { label: 'Éditions', icon: Printer, path: '/editions' },
    { label: 'Numérisation', icon: Scan, path: '/numerisation' },
    { label: 'Historique', icon: History, path: '/historique' },
    { label: 'Notifications', icon: Bell, path: '/notifications' },
  ],
  destinataire: [
    { label: 'Tableau de bord', icon: LayoutDashboard, path: '/destinataire/dashboard' },
    { label: 'Courriers Reçus', icon: Inbox, path: '/destinataire/courriers-recus' },
    { label: 'Tâches à Traiter', icon: CheckSquare, path: '/destinataire/taches' },
    { label: 'Mes Envois', icon: Send, path: '/destinataire/mes-envois' },
    { label: 'Archives Service', icon: Archive, path: '/destinataire/archives' },
    { label: 'Notifications', icon: Bell, path: '/destinataire/notifications' },
  ],
  directeur: [
    { label: 'Vue Globale', icon: LayoutDashboard, path: '/directeur/dashboard' },
    { label: 'À Valider / Signer', icon: FileCheck, path: '/directeur/validations' },
    { label: 'Imputations', icon: Forward, path: '/directeur/imputations' },
    { label: 'Rapports & Stats', icon: BarChart3, path: '/directeur/rapports' },
    { label: 'Registre Archives', icon: Archive, path: '/directeur/archives' },
    { label: 'Notifications', icon: Bell, path: '/directeur/notifications' },
  ],
  admin: [
    { label: 'Supervision', icon: LayoutDashboard, path: '/admin/dashboard' },
    { label: 'Utilisateurs', icon: Users, path: '/admin/utilisateurs' },
    { label: 'Services', icon: Building2, path: '/admin/services' },
    { label: 'Rôles & Droits', icon: ShieldCheck, path: '/admin/roles' },
    { label: 'Types de Courrier', icon: FolderKanban, path: '/admin/types-courriers' },
    { label: 'Logs d\'Audit', icon: Activity, path: '/admin/logs' },
    { label: 'Sauvegardes', icon: Database, path: '/admin/sauvegardes' },
    { label: 'Notifications', icon: Bell, path: '/admin/notifications' },
  ],
};

const SidebarAdmin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const userRole = user?.role?.toLowerCase() || 'admin';
  const mainNavItems = NAV_ITEMS_BY_ROLE[userRole] || NAV_ITEMS_BY_ROLE.admin;

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

  return (
    <aside className="w-64 h-screen bg-[#A23354] text-white flex flex-col py-4 pl-3 pr-0 shadow-2xl shrink-0 overflow-hidden select-none">
      
      {/* Header Logo avec légère animation au survol */}
      <div className="flex items-center gap-3 px-2 mb-5 shrink-0 group cursor-pointer">
        <div className="w-9 h-9 rounded-full bg-white/20 p-0.5 flex items-center justify-center overflow-hidden shrink-0 transition-transform duration-300 group-hover:scale-105">
          <img 
            src={avatarImg} 
            alt="Logo" 
            className="w-full h-full object-cover rounded-full" 
          />
        </div>
        <span className="font-bold text-2xl tracking-wide font-serif italic text-white transition-opacity duration-300 group-hover:opacity-90">
          Letspa
        </span>
      </div>

      {/* Navigation Principale avec bouton actif fond blanc & animations */}
      <nav aria-label="Navigation principale" className="space-y-1.5 flex-1 pr-3 overflow-hidden">
        {mainNavItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3.5 px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out transform active:scale-95 ${
                isActive
                  ? 'bg-white text-[#A23354] font-bold rounded-l-full shadow-lg translate-x-1'
                  : 'text-white/80 hover:text-white hover:bg-white/10 rounded-lg hover:translate-x-1'
              }`
            }
          >
            <Icon className="w-4.5 h-4.5 shrink-0 transition-transform duration-200" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Navigation Basse (Paramètres et Déconnexion) */}
      <div className="pt-3 pr-3 border-t border-white/15 space-y-1.5 shrink-0 mt-auto">
        <NavLink
          to="/parametres"
          className={({ isActive }) =>
            `w-full flex items-center gap-3.5 px-4 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out transform active:scale-95 ${
              isActive
                ? 'bg-white text-[#A23354] font-bold rounded-l-full shadow-lg translate-x-1'
                : 'text-white/80 hover:text-white hover:bg-white/10 rounded-lg hover:translate-x-1'
            }`
          }
        >
          <Settings className="w-4.5 h-4.5 shrink-0" aria-hidden="true" />
          <span className="truncate">Paramètres</span>
        </NavLink>

        <button
          type="button"
          onClick={() => setLogoutModalOpen(true)}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-sm font-medium text-white/90 hover:bg-red-500/30 hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" aria-hidden="true" />
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

export default SidebarAdmin;