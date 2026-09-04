import { useEffect, useState } from "react";
import { LogOut, X } from "lucide-react";

/**
 * LogoutConfirmModal : boîte de dialogue de confirmation avant déconnexion.
 * - Fermeture via Échap, clic en dehors, ou bouton Annuler
 * - État de chargement pendant l'appel réseau de déconnexion
 */
function LogoutConfirmModal({ open, onConfirm, onCancel, loading = false }) {
  const [visible, setVisible] = useState(false);

  // Petite transition d'entrée (opacité + échelle) sans dépendre de keyframes globaux
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm px-4 transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      onClick={() => !loading && onCancel()}
    >
      <div
        className={`w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 transition-all duration-200 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-red-600" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition disabled:opacity-50"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 id="logout-modal-title" className="mt-4 text-base font-semibold text-gray-900">
          Se déconnecter ?
        </h2>
        <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">
          Tu devras saisir à nouveau tes identifiants pour accéder à ton espace.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Déconnexion..." : "Se déconnecter"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutConfirmModal;
