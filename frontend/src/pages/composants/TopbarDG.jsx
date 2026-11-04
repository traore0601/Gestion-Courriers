import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Mail, 
  Bell, 
  ChevronDown, 
  LogOut, 
  UserCircle,
  Loader2,
  CheckCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";
import LogoutConfirmModal from "./LogoutConfirmModal.jsx";

// API
import { 
  fetchNotifications, 
  markNotificationAsRead 
} from "/src/pages/api/apiClient";

const TopBarDG = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Données utilisateur
  const displayName = user?.nom_complet || user?.username || "Utilisateur";
  const displayRole = user?.role_display || user?.role || "—";
  const photoUrl = user?.photo_url || null;

  // États locaux
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // État des notifications dynamiques
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);

  const menuRef = useRef(null);
  const notifRef = useRef(null);

  // --- 1. CHARGEMENT DYNAMIQUE DES NOTIFICATIONS ---
  const loadNotifs = useCallback(async () => {
    try {
      setLoadingNotifs(true);
      const data = await fetchNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur de récupération des notifications :", err);
    } finally {
      setLoadingNotifs(false);
    }
  }, []);

  useEffect(() => {
    loadNotifs();

    // Polling facultatif : Rafraîchit les notifications toutes les 30s
    const interval = setInterval(loadNotifs, 30000);
    return () => clearInterval(interval);
  }, [loadNotifs]);

  const nonLusCount = notifications.filter((n) => !n.lu).length;

  // --- 2. FERMETURE AU CLIC EXTÉRIEUR ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- 3. RECHERCHE DYNAMIQUE ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // --- 4. DECONNEXION ---
  const handleConfirmLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
      setLogoutModalOpen(false);
    }
  };

  // --- 5. MARQUER NOTIFICATION COMME LUE ---
  const handleMarkAsRead = async (item) => {
    if (item.lu) return;
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, lu: true } : n))
    );
    try {
      await markNotificationAsRead(item.id);
    } catch (err) {
      console.error("Erreur lors du marquage comme lu :", err);
    }
  };

  return (
    <nav className="bg-white px-6 py-1 flex items-center justify-between border-b border-gray-200 w-full font-sans sticky top-0 z-10">
      
      {/* --- BARRE DE RECHERCHE DYNAMIQUE --- */}
      <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm mx-auto">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher..."
          className="w-full h-8 p-3 pr-10 bg-gray-100 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition outline-none"
        />
      </form>

      {/* --- ACTIONS ET PROFIL --- */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-500">
          {/* Bouton Messages */}
          <button 
            onClick={() => navigate("/messages")} 
            className="hover:text-gray-800 transition p-1"
            title="Messagerie"
          >
            <Mail className="h-5 w-5" />
          </button>

          {/* --- MENU DÉROULANT DES NOTIFICATIONS --- */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative hover:text-gray-800 transition p-1 outline-none"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {nonLusCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {nonLusCount > 9 ? "9+" : nonLusCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">Notifications</span>
                  <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    {nonLusCount} non lue(s)
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                  {loadingNotifs && (
                    <div className="p-4 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                      <Loader2 size={16} className="animate-spin text-amber-500" />
                      Chargement...
                    </div>
                  )}

                  {!loadingNotifs && notifications.length === 0 && (
                    <div className="p-4 text-center text-xs text-gray-400">
                      Aucune notification
                    </div>
                  )}

                  {!loadingNotifs &&
                    notifications.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleMarkAsRead(item)}
                        className={`p-3 text-xs cursor-pointer hover:bg-gray-50 transition flex items-start gap-2 ${
                          !item.lu ? "bg-amber-50/40 font-semibold" : "text-gray-600"
                        }`}
                      >
                        <div className="flex-1">
                          <p className="text-gray-800 truncate">{item.titre || item.title}</p>
                          <p className="text-gray-500 font-normal line-clamp-2">{item.message}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {item.date || item.created_at}
                          </span>
                        </div>
                        {!item.lu && (
                          <span className="h-2 w-2 rounded-full bg-amber-500 mt-1 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                </div>

                <button
                  onClick={() => {
                    setNotifOpen(false);
                    navigate("/notifications");
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-blue-600 hover:bg-gray-50 border-t border-gray-100 transition"
                >
                  Voir toutes les notifications
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- MENU DEROULANT DU PROFIL --- */}
        <div className="relative pl-4 border-l border-gray-200" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-3 rounded-full py-1 pr-1 pl-1 hover:bg-gray-50 transition outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <Avatar src={photoUrl} name={displayName} size={32} />

            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-800 leading-tight">
                {displayName}
              </span>
              <span className="text-xs text-gray-500">{displayRole}</span>
            </div>

            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20"
            >
              <div className="px-3.5 py-2.5 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/profil");
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <UserCircle className="h-4 w-4 text-gray-400" />
                Mon profil
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  setLogoutModalOpen(true);
                }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL DE DECONNEXION --- */}
      <LogoutConfirmModal
        open={logoutModalOpen}
        loading={loggingOut}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutModalOpen(false)}
      />
    </nav>
  );
};

export default TopBarDG;