import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';

function DeconnexionPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    (async () => {
      await logout();
      navigate('/login', { replace: true });
    })();
  }, [logout, navigate]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 text-sm font-medium">Déconnexion en cours...</p>
    </div>
  );
}

export default DeconnexionPage; // 👈 Ligne essentielle