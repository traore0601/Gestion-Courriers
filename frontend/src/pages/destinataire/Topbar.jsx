import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-16 bg-slate-900 text-white flex items-center justify-between px-6 border-b border-slate-800 shrink-0">
      <div>
        <h1 className="text-base font-bold tracking-wide">GEC PRO / MailFlow</h1>
        <p className="text-xs text-slate-400">Tableau de Bord Destinataire</p>
      </div>

      {/* Recherche */}
      <div className="relative w-80">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Rechercher par expéditeur, objet, référence..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Notification & Profil */}
      <div className="flex items-center space-x-4">
        <button className="relative p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
            3
          </span>
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-semibold">
            <User className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium text-slate-200">
            Élodie Martin (Resp. Comptabilité)
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;