import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  getAccessToken,
  getStoredUser,
  loginRequest,
  logoutRequest,
  fetchCurrentUser,
} from "../api/apiClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  // Synchronise le state local React ET le localStorage avec les données les plus récentes
  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const token = getAccessToken();
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const currentUser = await fetchCurrentUser();
        if (isMounted) {
          setUser(currentUser);
          // Met à jour la clé 'auth_user' dans le localStorage avec les infos fraîches du backend
          localStorage.setItem("auth_user", JSON.stringify(currentUser));
        }
      } catch {
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    bootstrap();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const loggedInUser = await loginRequest(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (...roles) => !!user && (user.is_superuser || roles.includes(user.role)),
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      hasRole,
    }),
    [user, loading, login, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un <AuthProvider>.");
  }
  return context;
}

export default AuthContext;