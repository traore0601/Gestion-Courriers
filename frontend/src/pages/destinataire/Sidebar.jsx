import React, { useState } from 'react';
import { 
  Inbox, 
  Send, 
  FileText, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard
} from 'lucide-react';

const Sidebar = ({ currentTab, onSelectTab }) => {
  // État pour réduire / agrandir la sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);
  // État local de l'élément sélectionné si non passé en props
  const [activeItem, setActiveItem] = useState(currentTab || 'dashboard');

  // Configuration dynamique des éléments du menu
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'courriers-entrants', label: 'Courriers Entrants', icon: Inbox, badge: 12 },
    { id: 'courriers-sortants', label: 'Courriers Sortants', icon: Send },
    { id: 'archives', label: 'Archives & Dossiers', icon: FileText },
    { id: 'personnels', label: 'Gestion Personnels', icon: Users },
    { id: 'parametres', label: 'Paramètres', icon: Settings },
  ];

  const handleItemClick = (id) => {
    setActiveItem(id);
    if (onSelectTab) onSelectTab(id);
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col justify-between transition-all duration-300 ease-in-out z-20 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* HAUT : ENTÊTE + BOUTON BASCULE */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {!isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden transition-all duration-300">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0">
                GC
              </div>
              <span className="font-bold text-gray-800 text-base whitespace-nowrap">
                Gestion Courrier
              </span>
            </div>
          )}

          {isCollapsed && (
            <div className="mx-auto h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              GC
            </div>
          )}

          {/* BOUTON RETRACTATION / AGRANDISSEMENT */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95 ${
              isCollapsed ? 'mt-2 mx-auto block' : ''
            }`}
            title={isCollapsed ? 'Agrandir le menu' : 'Réduire le menu'}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* LISTE DES BOUTONS DU MENU */}
        <nav className="p-3 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {/* BANDE BLEUE INDICATRICE À GAUCHE */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
                )}

                {/* ICÔNE AVEC ANIMATION REBON/ÉCHELLE */}
                <Icon
                  className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                />

                {/* LIBELLÉ DU MENU (MASQUÉ SI RÉDUIT) */}
                {!isCollapsed && (
                  <span className="truncate transition-opacity duration-200">
                    {item.label}
                  </span>
                )}

                {/* BADGE COMPTEUR (EX: NOMBRE DE COURRIERS) */}
                {item.badge && !isCollapsed && (
                  <span
                    className={`ml-auto px-2 py-0.5 text-xs font-semibold rounded-full ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 group-hover:bg-gray-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* BULLE INFO EN MODE RÉDUIT (TOOLTIP SURVOL) */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1 bg-gray-900 text-white text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-30">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* BAS DE SIDEBAR / FOOTER */}
      <div className="p-3 border-t border-gray-100">
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
          {!isCollapsed && (
            <span className="text-xs font-medium text-gray-600 truncate">
              Système Connecté
            </span>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;