// Les 4 seuls tableaux de bord autorisés
export const DASHBOARD_PATHS = {
  ADMIN: '/dashboard-admin',
  SECRETAIRE: '/dashboard-secretaire',
  SERVICE: '/dashboard-service',
  DG: '/direction-generale/dashboard',
};

/**
 * Retourne le chemin exact vers l'un des 4 dashboards.
 * Renvoie `null` si l'utilisateur n'a pas de rôle valide.
 */
export function getDashboardPath(user) {
  if (!user) return null;

  // 1. Administrateur
  if (user.is_superuser || user.role === 'ADMIN') {
    return DASHBOARD_PATHS.ADMIN;
  }

  // 2. Gestion de l'alias DIRECTION -> DG
  const role = user.role === 'DIRECTION' ? 'DG' : user.role;

  // 3. Renvoie la page correspondante OU null si le rôle ne fait pas partie des 4
  return DASHBOARD_PATHS[role] || null;
}