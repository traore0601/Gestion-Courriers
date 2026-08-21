import React from 'react';
import { Search, Mail, Bell, ChevronDown } from 'lucide-react';
import avatarImg from "../assets/hero.jpg";

const TopBar = () => {
  return (
    <nav className="bg-white px-6 py-1 flex items-center justify-between border-b border-gray-200 w-full font-sans sticky top-0 z-10">
      
      {/* --- PARTIE GAUCHE : Barre de recherche --- */}
      <div className="relative w-full  max-w-sm mx-auto">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-8 p-3 pr-10 bg-gray-100 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition outline-none"
        />
      </div>

      {/* --- PARTIE DROITE : Actions et Profil --- */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-500">
          <button className="hover:text-gray-800 transition p-1">
            <Mail className="h-5 w-5" />
          </button>
          
          <button className="relative hover:text-gray-800 transition p-1">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500"></span>
          </button>
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <img
    src={avatarImg}
    alt="Avatar de Marie-Noelle Ester"
    className="h-8 w-8 rounded-full object-cover border border-gray-200"
  />
          
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800 leading-tight">
              Marie-Noelle Ester
            </span>
            <span className="text-xs text-gray-500">
              Secretaire
            </span>
          </div>

          <button className="text-gray-400 hover:text-gray-600 transition ml-1">
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

      </div>
    </nav>
  );
};

export default TopBar;