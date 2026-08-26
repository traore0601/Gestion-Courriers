import { Routes, Route } from 'react-router-dom';
import Layout from './composants/Layout.jsx';
import AppRoutes from './AppRoutes.jsx';
import LoginPage from './LoginPage.jsx';
import ProtectedRoute from './composants/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      {/* Route publique : connexion */}
      <Route path="/login" element={<LoginPage />} />

      {/* Toutes les autres routes nécessitent d'être authentifié */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <AppRoutes />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;