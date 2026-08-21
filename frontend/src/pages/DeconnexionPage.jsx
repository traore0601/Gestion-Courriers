import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DeconnexionPage() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 text-sm font-medium">Déconnexion en cours...</p>
    </div>
  );
}

export default DeconnexionPage; // 👈 Ligne essentielle