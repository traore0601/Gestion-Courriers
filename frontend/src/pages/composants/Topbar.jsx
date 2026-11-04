import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mail, Bell, ChevronDown, LogOut, UserCircle, Check, Inbox } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotifications } from "../context/NotificationContext.jsx";
import Avatar from "./Avatar.jsx";
import LogoutConfirmModal from "./LogoutConfirmModal.jsx";

const TopBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const displayName = user?.nom_complet || user?.username || "Utilisateur";
  const displayRole = user?.role_display || user?.role || "—";
  const photoUrl = user?.photo_url || null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  // Ferme les menus déroulants au clic en dehors
  useEffect(() => {
    if (!menuOpen && !notifOpen) return;
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
  }, [menuOpen, notifOpen]);

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

  const handleNotifClick = (notif) => {
    if (!notif.is_read) markAsRead(notif.id);
    setNotifOpen(false);
    if (notif.lien) navigate(notif.lien);
  };

  const recentNotifications = notifications.slice(0, 6);

  return (
    <nav className="bg-white px-6 py-1 flex items-center justify-between border-b border-gray-200 w-full font-sans sticky top-0 z-10">
      {/* --- PARTIE GAUCHE : Barre de recherche --- */}
      <div className="relative w-full  max-w-sm mx-auto">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-8 p-3 pr-10 bg-gray-100 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition outline-none"
        />
      </div>

      {/* --- PARTIE DROITE : Actions et Profil --- */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-500">
          <button className="hover:text-gray-800 transition p-1">
            <Mail className="h-5 w-5" />
          </button>

          {/* --- Cloche de notifications dynamique --- */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              className="relative hover:text-gray-800 transition p-1"
              aria-haspopup="menu"
              aria-expanded={notifOpen}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full ring-2 ring-white bg-red-500 text-[9px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20"
              >
                <div className="px-3.5 py-2 border-b border-gray-100 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800">Notifications</p>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Tout marquer lu
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {recentNotifications.length === 0 ? (
                    <div className="px-3.5 py-6 text-center text-gray-400">
                      <Inbox className="w-6 h-6 mx-auto mb-1 text-gray-300" />
                      <p className="text-xs">Aucune notification</p>
                    </div>
                  ) : (
                    recentNotifications.map((notif) => (
                      <button
                        key={notif.id}
                        onClick={() => handleNotifClick(notif)}
                        className={`w-full text-left px-3.5 py-2.5 flex flex-col gap-0.5 border-b border-gray-50 last:border-0 transition-colors ${
                          notif.is_read ? "hover:bg-gray-50" : "bg-blue-50/50 hover:bg-blue-50"
                        }`}
                      >
                        <span className={`text-xs font-semibold truncate ${notif.is_read ? "text-gray-700" : "text-gray-900"}`}>
                          {notif.titre}
                        </span>
                        <span className="text-[11px] text-gray-500 line-clamp-2">{notif.message}</span>
                        <span className="text-[10px] text-gray-400">{notif.time_ago}</span>
                      </button>
                    ))
                  )}
                </div>

                <button
                  onClick={() => {
                    setNotifOpen(false);
                    navigate("/notifications");
                  }}
                  className="w-full text-center text-[11px] font-medium text-blue-600 hover:text-blue-800 py-2 border-t border-gray-100"
                >
                  Voir toutes les notifications
                </button>
              </div>
            )}
          </div>
        </div>

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
              className={`h-4 w-4 text-gray-400 transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* --- Menu déroulant du profil --- */}
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20"
            >
              <div className="px-3.5 py-2.5 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
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

      <LogoutConfirmModal
        open={logoutModalOpen}
        loading={loggingOut}
        onConfirm={handleConfirmLogout}
        onCancel={() => setLogoutModalOpen(false)}
      />
    </nav>
  );
};

export default TopBar;
