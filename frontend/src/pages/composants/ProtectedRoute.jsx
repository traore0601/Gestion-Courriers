import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm font-medium">Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && !hasRole(...roles)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-sm font-medium">
          Vous n'avez pas les droits nécessaires pour accéder à cette page.
        </p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
