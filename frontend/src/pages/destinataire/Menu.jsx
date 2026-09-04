import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Centre from './Centrebar';

function Menu() {
  return (
    <div className="flex h-screen bg-slate-900 text-slate-800 font-sans text-sm">
      {/* 1. Sidebar à gauche */}
      <Sidebar />

      {/* Zone principale à droite */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-200">
        {/* 2. Topbar en haut */}
        <Topbar />

        {/* 3. Centre (tableau principal) */}
        <Centre />
      </div>
    </div>
  );
}

export default Menu;