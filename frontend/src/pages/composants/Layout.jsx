import TopBar from "./Topbar.jsx";
import SideBar from "./Sidebar.jsx";

function Layout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* 1. Sidebar fixe à gauche */}
      <SideBar />

      {/* 2. Conteneur droit (Navbar + Contenu) */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {/* Navbar fixe en haut */}
        <TopBar />

        {/* Zone de contenu réactive qui prend tout le reste de l'espace */}
        <main className="flex-1 px-8 py-2  overflow-y-auto w-full h-full bg-white flex flex-col items-center mt-3 ml-3 mb-3 rounded-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;