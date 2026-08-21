import { Routes, Route, Navigate } from 'react-router-dom';

// Page de Connexion (Ajustez le nom/chemin selon votre fichier)
import Deconnexion from './DeconnexionPage.jsx'; 

// 1. Pages / Formulaires de saisie
import CourriersEntrant from './CourrierEntrantPage.jsx';
import CourriersInternes from './CourriersInternesPage.jsx';
import CourriersDeparts from './CourriersDepartsPage.jsx';
import EntrantPage from './EntrantPage.jsx';

// 2. Pages de Listes
import ListeCourriersEntrants from './courriers/ListeCourriersEntrants.jsx';
import ListeCourriersInternes from './courriers/ListeCourriersInternes.jsx';
import ListeCourriersSortants from './courriers/ListeCourriersSortants.jsx';

// 3. Autres pages
import Dashboard from './DashboardPage.jsx';
import Editions from './EditionsPage.jsx';
import Numerisation from './NumerisationPage.jsx';
import Historique from './HistoriquePage.jsx';
import Notifications from './NotificationsPage.jsx';
import Parametres from './ParametresPage.jsx';
import Aide from './AidePage.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Route publique de connexion */}
      <Route path="/deconnexion" element={<Deconnexion />} />

      {/* Redirection initiale */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Courriers Entrants */}
      <Route path="/entrant" element={<EntrantPage />} />
      <Route path="/courriers-arrives" element={<CourriersEntrant />} />
      <Route path="/liste-courrier-entrant" element={<ListeCourriersEntrants />} />
      
      {/* Courriers Internes */}
      <Route path="/courriers-internes" element={<CourriersInternes />} />
      <Route path="/liste-courriers-internes" element={<ListeCourriersInternes />} />
      
      {/* Courriers Sortants / Départs */}
      <Route path="/courriers-departs" element={<CourriersDeparts />} />
      <Route path="/liste-courriers-sortants" element={<ListeCourriersSortants />} />
      
      {/* Autres modules */}
      <Route path="/editions" element={<Editions />} />
      <Route path="/numerisation" element={<Numerisation />} />
      <Route path="/historique" element={<Historique />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/parametres" element={<Parametres />} />
      <Route path="/aide" element={<Aide />} />

      {/* Fallback : Redirection vers /login si la route n'existe pas */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;