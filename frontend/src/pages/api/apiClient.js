// Client API centralisé pour communiquer avec le backend Django.
// Gère automatiquement l'ajout du token JWT et le rafraîchissement
// du token d'accès lorsque celui-ci a expiré.
// À la fin de src/pages/api/apiClient.js
export { deleteNotificationRequest as deleteNotificationApi };
export const API_BASE_URL = "http://127.0.0.1:8000";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession({ access, refresh, user }) {
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

let refreshingPromise = null;

async function refreshAccessToken() {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  // Évite les rafraîchissements concurrents multiples
  if (!refreshingPromise) {
    refreshingPromise = fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const data = await res.json();
        localStorage.setItem(ACCESS_TOKEN_KEY, data.access);
        if (data.refresh) {
          localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
        }
        return true;
      })
      .catch(() => false)
      .finally(() => {
        refreshingPromise = null;
      });
  }
  return refreshingPromise;
}

/**
 * authFetch : équivalent de fetch() mais ajoute automatiquement
 * l'en-tête Authorization et tente un rafraîchissement du token
 * en cas de réponse 401 (token expiré).
 */
export async function authFetch(url, options = {}) {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
  const token = getAccessToken();

  const buildHeaders = (accessToken) => {
    const headers = new Headers(options.headers || {});
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  };

  let response = await fetch(fullUrl, {
    ...options,
    headers: buildHeaders(token),
  });

  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      response = await fetch(fullUrl, {
        ...options,
        headers: buildHeaders(getAccessToken()),
      });
    } else {
      clearSession();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  }

  return response;
}

/* ==========================================================================
   AUTHENTIFICATION & UTILISATEURS
   ========================================================================== */

/**
 * Appelle le endpoint de connexion et enregistre la session en cas de succès.
 */
export async function loginRequest(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data.detail ||
      (data.non_field_errors && data.non_field_errors[0]) ||
      "Email ou mot de passe incorrect.";
    throw new Error(message);
  }

  saveSession({ access: data.access, refresh: data.refresh, user: data.user });
  return data.user;
}

/**
 * Déconnecte l'utilisateur : blacklist le refresh token côté serveur
 * puis nettoie la session locale.
 */
export async function logoutRequest() {
  const refresh = getRefreshToken();
  try {
    if (refresh) {
      await authFetch("/api/token/logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
    }
  } catch {
    // Ignore les erreurs réseau : nettoyage local systématique.
  } finally {
    clearSession();
  }
}

/**
 * Récupère les informations de l'utilisateur actuellement connecté.
 */
export async function fetchCurrentUser() {
  const response = await authFetch("/api/me/");
  if (!response.ok) {
    throw new Error("Impossible de récupérer l'utilisateur courant.");
  }
  return response.json();
}

/* ==========================================================================
   NOTIFICATIONS
   ========================================================================== */

export async function fetchNotifications() {
  const response = await authFetch("/api/notifications/");
  if (!response.ok) {
    throw new Error("Impossible de récupérer les notifications.");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.results || [];
}

/**
 * Récupère uniquement le nombre de notifications non lues.
 */
export async function fetchUnreadNotificationsCount() {
  const response = await authFetch("/api/notifications/unread_count/");
  if (!response.ok) {
    throw new Error("Impossible de récupérer le compteur de notifications.");
  }
  const data = await response.json();
  return data.unread_count;
}

/**
 * Marque une notification précise comme lue.
 */
export async function markNotificationAsRead(id) {
  const response = await authFetch(`/api/notifications/${id}/mark_read/`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Impossible de marquer la notification comme lue.");
  }
  return response.json();
}

/**
 * Marque toutes les notifications de l'utilisateur comme lues.
 */
export async function markAllNotificationsAsRead() {
  const response = await authFetch("/api/notifications/mark_all_read/", {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Impossible de marquer toutes les notifications comme lues.");
  }
  return response.json();
}

/**
 * Supprime une notification.
 */
export async function deleteNotificationRequest(id) {
  const response = await authFetch(`/api/notifications/${id}/`, {
    method: "DELETE",
  });
  if (!response.ok && response.status !== 204) {
    throw new Error("Impossible de supprimer la notification.");
  }
}

/* ==========================================================================
   TABLEAU DE BORD & COURRIERS
   ========================================================================== */

/**
 * Récupère la liste des courriers destinés au service/destinataire.
 */
export async function fetchCourriersDestinataire() {
  const response = await authFetch("/api/courriers/destinataire/");
  if (!response.ok) {
    throw new Error("Impossible de charger la liste des courriers.");
  }
  const data = await response.json();
  return Array.isArray(data) ? data : data.results || [];
}

/**
 * Met à jour le statut d'un courrier (ex: "Pris en charge").
 */
export async function updateStatutCourrier(id, statut) {
  const response = await authFetch(`/api/courriers/${id}/statut/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ statut }),
  });
  if (!response.ok) {
    throw new Error("Impossible de modifier le statut du courrier.");
  }
  return response.json();
}

/**
 * Récupère les statistiques dynamiques pour le tableau de bord du service/destinataire.
 */
export async function fetchDashboardStatsDestinataire() {
  const response = await authFetch("/api/dashboard/destinataire/stats/");
  if (!response.ok) {
    throw new Error("Impossible de charger les statistiques du tableau de bord.");
  }
  return response.json();
}