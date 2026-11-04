import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { getDashboardPath } from './api/roleRedirect.js';
import ProtectedRoute from './composants/ProtectedRoute.jsx';

import AdminLayout from './composants/AdminLayout.jsx';
import LayoutSecretaire from './composants/LayoutSecretaire.jsx';
import LayoutService from './composants/LayoutService.jsx';
import LayoutDG from './composants/LayoutDG.jsx';

// Imports pour le rôle SERVICE
import BoitedeReception from './destinataire/navigation/BoitedeReception.jsx';
import AideSupport from './destinataire/navigation/AideSupport.jsx';
import EspaceCollaborateurs from './destinataire/navigation/EspaceCollaborateurs.jsx';
import ParametresD from './destinataire/navigation/Parametre.jsx';
import ProjetdeReponse from './destinataire/navigation/ProjetdeReponse.jsx';
import SuivietApports from './destinataire/navigation/SuivietApports.jsx';
import SignatureetCloture from './destinataire/navigation/SignatureetCloture.jsx';

// Imports pour le rôle DIRECTION GÉNÉRALE
import DashbordDG from './directionGenerale/Navigation/Dashbord.jsx';
import BoitedeReceptionDG from './directionGenerale/Navigation/BoitedeReception.jsx';
import ArchiveServiceDG from './directionGenerale/Navigation/ArchiveService.jsx';
import AideetSupportDG from './directionGenerale/Navigation/AideetSupport.jsx';
import TacheDG from './directionGenerale/Navigation/TacheaTraiter.jsx';
import EnvoiDG from './directionGenerale/Navigation/Envoi.jsx';
import NotificationDG from './directionGenerale/Navigation/Notification.jsx';
import ParametreDG from './directionGenerale/Navigation/Parametre.jsx';

// Imports pour le rôle SECRÉTAIRE
import CourriersEntrant from './CourrierEntrantPage.jsx';
import CourriersInternes from './CourriersInternesPage.jsx';
import CourriersDeparts from './CourriersDepartsPage.jsx';
import EntrantPage from './EntrantPage.jsx';
import ListeCourriersEntrants from './courriers/ListeCourriersEntrants.jsx';

import DashboardSecretaire from './DashboardPage.jsx';
import DashboardAdmin from './DashboardAdmin.jsx';
import DashboardService from './DashboardService.jsx';
import Editions from './EditionsPage.jsx';
import Numerisation from './NumerisationPage.jsx';
import Historique from './HistoriquePage.jsx';
import Notifications from './NotificationsPage.jsx';
import Parametres from './ParametresPage.jsx';
import Aide from './AidePage.jsx';

const DashboardRedirect = () => {
  const { user } = useAuth();
  const target = getDashboardPath(user);
  if (!target) return <Navigate to="/login" replace />;
  return <Navigate to={target} replace />;
};

const withRole = (roles, LayoutComp, Page) => (
  <ProtectedRoute roles={roles}>
    <LayoutComp>
      <Page />
    </LayoutComp>
  </ProtectedRoute>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardRedirect />} />

      {/* ADMIN */}
      <Route path="/dashboard-admin" element={withRole(['ADMIN'], AdminLayout, DashboardAdmin)} />

      {/* SECRÉTAIRE */}
      <Route path="/dashboard-secretaire" element={withRole(['SECRETAIRE'], LayoutSecretaire, DashboardSecretaire)} />
      <Route path="/entrant" element={withRole(['SECRETAIRE'], LayoutSecretaire, EntrantPage)} />
      <Route path="/courriers-entrant/*" element={withRole(['SECRETAIRE'], LayoutSecretaire,  CourriersEntrant)} />
      <Route path="/liste-courrier-entrant" element={withRole(['SECRETAIRE'], LayoutSecretaire, ListeCourriersEntrants)} />
      
      {/* COURRIERS INTERNES (Gestion via sous-routes /*) */}
      <Route path="/courriers-internes/*" element={withRole(['SECRETAIRE'], LayoutSecretaire, CourriersInternes)} />
      
      {/* COURRIERS DÉPARTS / SORTANTS (Gestion via sous-routes /*) */}
      <Route path="/courriers-departs/*" element={withRole(['SECRETAIRE'], LayoutSecretaire, CourriersDeparts)} />
      
      <Route path="/editions" element={withRole(['SECRETAIRE'], LayoutSecretaire, Editions)} />
      <Route path="/numerisation" element={withRole(['SECRETAIRE'], LayoutSecretaire, Numerisation)} />
      <Route path="/historique" element={withRole(['SECRETAIRE'], LayoutSecretaire, Historique)} />
      <Route path="/notifications" element={withRole(['SECRETAIRE'], LayoutSecretaire, Notifications)} />
      <Route path="/parametres" element={withRole(['SECRETAIRE'], LayoutSecretaire, Parametres)} />
      <Route path="/aide" element={withRole(['SECRETAIRE'], LayoutSecretaire, Aide)} />

      {/* SERVICE */}
      <Route path="/dashboard-service" element={withRole(['SERVICE'], LayoutService, DashboardService)} />
      <Route path="/courriers-recus" element={withRole(['SERVICE'], LayoutService, BoitedeReception)} />
      <Route path="/boite-reception" element={withRole(['SERVICE'], LayoutService, BoitedeReception)} />
      <Route path="/espace-collaborateurs" element={withRole(['SERVICE'], LayoutService, EspaceCollaborateurs)} />
      <Route path="/suivi-apports" element={withRole(['SERVICE'], LayoutService, SuivietApports)} />
      <Route path="/projet-reponse" element={withRole(['SERVICE'], LayoutService, ProjetdeReponse)} />
      <Route path="/signature-cloture" element={withRole(['SERVICE'], LayoutService, SignatureetCloture)} />
      <Route path="/recherche-multicritere" element={withRole(['SERVICE'], LayoutService, BoitedeReception)} />
      <Route path="/parametres-service" element={withRole(['SERVICE'], LayoutService, ParametresD)} />
      <Route path="/aide-service" element={withRole(['SERVICE'], LayoutService, AideSupport)} />

      {/* DIRECTION GÉNÉRALE (DG) */}
      <Route path="/direction-generale/dashboard" element={withRole(['DG'], LayoutDG, DashbordDG)} />
      <Route path="/direction-generale/courriers-recus" element={withRole(['DG'], LayoutDG, BoitedeReceptionDG)} />
      <Route path="/direction-generale/archives" element={withRole(['DG'], LayoutDG, ArchiveServiceDG)} />
      <Route path="/direction-generale/aide" element={withRole(['DG'], LayoutDG, AideetSupportDG)} />
      <Route path="/direction-generale/tache" element={withRole(['DG'], LayoutDG, TacheDG)} />
      <Route path="/direction-generale/envoi" element={withRole(['DG'], LayoutDG, EnvoiDG)} />
      <Route path="/direction-generale/notifications" element={withRole(['DG'], LayoutDG, NotificationDG)} />
      <Route path="/direction-generale/parametres" element={withRole(['DG'], LayoutDG, ParametreDG)} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;