import React, { useState, useEffect } from 'react';
import { Search, Mail, Bell, ChevronDown, User, LogOut } from 'lucide-react';
import avatarImg from "../assets/hero.jpg";

const API_BASE = 'http://127.0.0.1:8000/api';

const TopBar = ({ onSearch, unreadCount = 3 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState({
    nom: 'Utilisateur',
    role: '',
    photo: avatarImg,
  });

  // Construit l'objet à afficher à partir d'un Utilisateur renvoyé par l'API
  const appliquerUtilisateur = (data) => {
    const personnel = data.personnel_detail;
    setCurrentUser({
      nom: personnel
        ? `${personnel.civilite ? personnel.civilite + ' ' : ''}${personnel.nom_prenom}`
        : data.email,
      role: personnel?.fonction || '',
      photo: personnel?.photo || avatarImg,
    });
  };

  useEffect(() => {
    // ID enregistré lors du login (à mettre en place avec la page de connexion)
    const utilisateurId = localStorage.getItem('utilisateur_id');

    if (utilisateurId) {
      fetch(`${API_BASE}/utilisateurs/${utilisateurId}/`)
        .then((res) => {
          if (!res.ok) throw new Error("Impossible de charger l'utilisateur connecté.");
          return res.json();
        })
        .then(appliquerUtilisateur)
        .catch((err) => console.error(err));
    } else {
      // ⚠️ Temporaire : tant que la page de connexion n'existe pas,
      // on affiche le premier utilisateur trouvé en base pour pouvoir tester.
      // À retirer une fois le login en place.
      fetch(`${API_BASE}/utilisateurs/`)
        .then((res) => res.json())
        .then((data) => {
          const liste = Array.isArray(data) ? data : data.results || [];
          if (liste.length > 0) appliquerUtilisateur(liste[0]);
        })
        .catch((err) => console.error(err));
    }
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value); // Envoie la recherche au composant parent
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('utilisateur_id');
    console.log("Déconnexion...");
  };

  return (
    <nav className="bg-white px-6 py-1 flex items-center justify-between border-b border-gray-200 w-full font-sans sticky top-0 z-10">
      
      {/* BARRE DE RECHERCHE DYNAMIQUE */}
      <div className="relative w-full max-w-sm mx-auto">
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Rechercher un courrier, un dossier..."
          className="w-full h-8 p-3 pr-10 bg-gray-100 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition outline-none"
        />
      </div>

      {/* PARTIE DROITE */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-500">
          <button 
            className="hover:text-gray-800 transition p-1"
            title="Messages"
          >
            <Mail className="h-5 w-5" />
          </button>
          
          <button 
            className="relative hover:text-gray-800 transition p-1"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-red-500"></span>
            )}
          </button>
        </div>

        {/* MENU PROFIL ET UTILISATEUR DYNAMIQUE */}
        <div className="relative pl-4 border-l border-gray-200">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 focus:outline-none"
          >
            <img
              src={currentUser.photo}
              alt={`Avatar de ${currentUser.nom}`}
              className="h-8 w-8 rounded-full object-cover border border-gray-200"
            />
            
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-800 leading-tight">
                {currentUser.nom}
              </span>
              <span className="text-xs text-gray-500">
                {currentUser.role}
              </span>
            </div>

            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* MENU DÉROULANT AU CLIC */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
              <a 
                href="#profile" 
                className="flex items-center gap-2 px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition"
              >
                <User className="h-4 w-4 text-gray-500" /> Mon profil
              </a>
              <button 
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-gray-100 transition border-t border-gray-100"
              >
                <LogOut className="h-4 w-4 text-red-500" /> Se déconnecter
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default TopBar;
