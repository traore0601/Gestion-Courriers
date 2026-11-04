import React, { useState } from 'react';
import { 
  Archive, 
  FolderArchive, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Eye, 
  Building2, 
  Calendar, 
  ShieldAlert, 
  MapPin, 
  ChevronRight 
} from 'lucide-react';

// Données de démonstration des archives par service
const ARCHIVES_INITIALES = [
  {
    id: 1,
    reference: "ARCH-2025-DAF-012",
    titre: "Rapport d'Audit Financier Annuel 2025",
    service: "Direction Financière (DAF)",
    dateArchivage: "14 Janvier 2026",
    anneeExercice: "2025",
    type: "Courrier Arrivé",
    emplacementPhysique: "Salle Archives A - Armoire 3 / Rayon 2",
    confidentiel: true,
    tailleFichier: "4.2 Mo"
  },
  {
    id: 2,
    reference: "ARCH-2025-DRH-045",
    titre: "Plan de Formation & Bilan Social 2025",
    service: "Ressources Humaines (DRH)",
    dateArchivage: "20 Décembre 2025",
    anneeExercice: "2025",
    type: "Courrier Interne",
    emplacementPhysique: "Salle Archives B - Armoire 1 / Rayon 4",
    confidentiel: false,
    tailleFichier: "2.8 Mo"
  },
  {
    id: 3,
    reference: "ARCH-2025-DSI-008",
    titre: "Contrat de Maintenance Infrastructures Réseau & Serveurs",
    service: "Direction SI (DSI)",
    dateArchivage: "05 Février 2026",
    anneeExercice: "2025",
    type: "Courrier Départ",
    emplacementPhysique: "Salle Archives A - Armoire 5 / Rayon 1",
    confidentiel: false,
    tailleFichier: "1.5 Mo"
  },
  {
    id: 4,
    reference: "ARCH-2024-JUR-099",
    titre: "Convention de Partenariat Stratégique International",
    service: "Service Juridique",
    dateArchivage: "18 Novembre 2024",
    anneeExercice: "2024",
    type: "Courrier Arrivé",
    emplacementPhysique: "Coffre-fort DG - Compartiment 2",
    confidentiel: true,
    tailleFichier: "8.1 Mo"
  },
  {
    id: 5,
    reference: "ARCH-2024-DAF-088",
    titre: "Inventaire du Patrimoine Immobilier & Équipements",
    service: "Direction Financière (DAF)",
    dateArchivage: "10 Décembre 2024",
    anneeExercice: "2024",
    type: "Courrier Interne",
    emplacementPhysique: "Salle Archives A - Armoire 2 / Rayon 3",
    confidentiel: false,
    tailleFichier: "5.4 Mo"
  }
];

const SERVICES_LISTE = [
  "Toutes les directions",
  "Direction Financière (DAF)",
  "Ressources Humaines (DRH)",
  "Direction SI (DSI)",
  "Service Juridique"
];

export default function ArchiveServiceDG() {
  const [archives, setArchives] = useState(ARCHIVES_INITIALES);
  const [recherche, setRecherche] = useState('');
  const [serviceSelectionne, setServiceSelectionne] = useState('Toutes les directions');
  const [anneeFiltre, setAnneeFiltre] = useState('Toutes');
  const [archiveSelectionnee, setArchiveSelectionnee] = useState(null);

  // Filtrage combiné
  const archivesFiltrees = archives.filter((item) => {
    const matchRecherche = 
      item.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      item.reference.toLowerCase().includes(recherche.toLowerCase());
    
    const matchService = 
      serviceSelectionne === 'Toutes les directions' || item.service === serviceSelectionne;

    const matchAnnee = 
      anneeFiltre === 'Toutes' || item.anneeExercice === anneeFiltre;

    return matchRecherche && matchService && matchAnnee;
  });

  return (
    <div className="w-full h-full bg-slate-50 border border-slate-200 rounded-2xl flex flex-col overflow-hidden font-sans">
      
      {/* 1. EN-TÊTE DE LA PAGE ARCHIVES SERVICE */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold shadow-sm">
            <Archive size={20} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Archives des Services & Directions</h2>
            <p className="text-xs text-slate-500">Consultation et traçabilité des dossiers classés et archivés par département.</p>
          </div>
        </div>

        {/* Compteur résumé */}
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          <FolderArchive size={16} className="text-slate-600" />
          <span className="text-xs font-bold text-slate-800">{archivesFiltrees.length} dossier(s) archivé(s)</span>
        </div>
      </div>

      {/* 2. BARRE DE RECHERCHE ET FILTRES */}
      <div className="p-3 bg-white border-b border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
        
        {/* Recherche par mot-clé */}
        <div className="relative md:col-span-2">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par titre, référence ou mot-clé..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Filtre par Service */}
        <div className="relative">
          <select
            value={serviceSelectionne}
            onChange={(e) => setServiceSelectionne(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 text-xs font-medium outline-none cursor-pointer"
          >
            {SERVICES_LISTE.map((srv, idx) => (
              <option key={idx} value={srv}>{srv}</option>
            ))}
          </select>
        </div>

        {/* Filtre par Année */}
        <div className="relative">
          <select
            value={anneeFiltre}
            onChange={(e) => setAnneeFiltre(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2 text-xs font-medium outline-none cursor-pointer"
          >
            <option value="Toutes">Toutes les années</option>
            <option value="2026">Exercice 2026</option>
            <option value="2025">Exercice 2025</option>
            <option value="2024">Exercice 2024</option>
          </select>
        </div>
      </div>

      {/* 3. TABLEAU / LISTE DES ARCHIVES */}
      <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
        {archivesFiltrees.length > 0 ? (
          <div className="grid grid-cols-1 gap-3">
            {archivesFiltrees.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-4 shadow-sm transition flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
              >
                {/* Section gauche : Infos archive */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 bg-slate-900 text-amber-400 text-[10px] font-mono font-bold rounded-lg">
                      {item.reference}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md flex items-center gap-1">
                      <Building2 size={12} /> {item.service}
                    </span>
                    {item.confidentiel && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded-md flex items-center gap-1">
                        <ShieldAlert size={12} /> Confidentiel
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-snug">
                    {item.titre}
                  </h3>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-slate-400" /> Archiver le : {item.dateArchivage}
                    </span>
                    <span className="flex items-center gap-1 text-slate-700 font-medium">
                      <MapPin size={13} className="text-amber-600" /> {item.emplacementPhysique}
                    </span>
                  </div>
                </div>

                {/* Section droite : Actions & Détails */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  <span className="text-[10px] text-slate-400 font-mono font-semibold mr-2">{item.tailleFichier}</span>
                  
                  <button
                    onClick={() => setArchiveSelectionnee(item)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition"
                    title="Voir la fiche complète"
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                    title="Télécharger l'acte numérisé"
                  >
                    <Download size={14} className="text-amber-400" /> Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <Archive size={36} className="text-slate-300 mb-2" />
            <p className="text-xs font-bold text-slate-700">Aucun dossier d'archive trouvé</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Essayez de modifier vos critères de recherche ou de filtre par direction.</p>
          </div>
        )}
      </div>

      {/* 4. MODALE DE CONSULTATION DÉTAILLÉE DE L'ARCHIVE */}
      {archiveSelectionnee && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 border border-slate-200 shadow-2xl space-y-4 font-sans">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-600 uppercase">{archiveSelectionnee.reference}</span>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{archiveSelectionnee.titre}</h3>
              </div>
              <button
                onClick={() => setArchiveSelectionnee(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Service d'origine</span>
                  <span className="font-bold text-slate-800">{archiveSelectionnee.service}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Exercice budgétaire</span>
                  <span className="font-bold text-slate-800">{archiveSelectionnee.anneeExercice}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] mb-0.5">Localisation du document physique</span>
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-slate-800 font-bold">
                  <MapPin size={16} className="text-amber-600" />
                  <span>{archiveSelectionnee.emplacementPhysique}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>Archivé le : {archiveSelectionnee.dateArchivage}</span>
                <span>Taille du fichier PDF : {archiveSelectionnee.tailleFichier}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setArchiveSelectionnee(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Fermer
              </button>
              <button
                onClick={() => alert("Téléchargement du document archivé en cours...")}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <Download size={14} /> Télécharger l'Archive PDF
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}