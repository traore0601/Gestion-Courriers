import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  FileText, 
  Send, 
  Printer, 
  Scan, 
  History, 
  Settings, 
  Bell, 
  LogOut,
  HelpCircle
} from 'lucide-react';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('Courriers Arrivés');

  const mainNavItems = [
    { label: 'Dashboard', icon: LayoutDashboard },
    { label: 'Courriers Arrivés', icon: Inbox },
    { label: 'Courriers Internes', icon: FileText },
    { label: 'Courriers Départs', icon: Send },
    { label: 'Éditions', icon: Printer },
    { label: 'Numérisation', icon: Scan },
    { label: 'Historique', icon: History },
    { label: 'Notifications', icon: Bell },
  ];

  const bottomNavItems = [
    { label: 'Paramètres', icon: Settings },
    { label: 'Aide & Support', icon: HelpCircle },
    { label: 'Déconnexion', icon: LogOut },
  ];

  return (
    <aside className="w-64 h-screen bg-blue-700 text-white flex flex-col  py-4 px-3 shadow-lg z-20 relative shrink-0">
      {/* Conteneur haut : Logo + Navigation principale */}
      <div className="flex flex-col">
        {/* Logo Section (réduit pour gagner de la place) */}
        <div className="flex flex-col items-center mb-3">
          <div className="text-2xl font-serif font-bold tracking-wider border-2 border-white/20 px-3 py-1 rounded-lg">
            AIB
          </div>
        </div>

        {/* Navigation Principale */}
        <nav className="space-y-0.5">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.label;

            return (
              <button
                type="button"
                key={item.label}
                onClick={() => setActiveItem(item.label)}
                className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-white text-blue-700 shadow'
                    : 'text-white hover:bg-blue-600/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Conteneur bas : Paramètres, Aide, Déconnexion */}
      <div className="pt-2 border-t border-blue-600/60 space-y-0.5 mt-30">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.label;

          return (
            <button
              type="button"
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={`w-full flex items-center gap-3 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-white/90 hover:bg-blue-600/50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;