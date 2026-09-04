import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Mail, 
  Send, 
  Inbox, 
  Settings, 
  Search, 
  Bell, 
  FileText, 
  Download, 
  User, 
  Calendar 
} from 'lucide-react';

function Menu() {
  const [courriers, setCourriers] = useState([
    {
      id: 'CR-2026-084',
      date: '21/08/2026 14:30',
      expediteur: 'URSSAF Ile-de-France',
      objet: 'Notification de Cotisations T3 2026',
      priorite: 'CRITIQUE',
      fichier: 'courrier_084.pdf',
      statut: 'En attente de prise en charge'
    },
    {
      id: 'CR-2026-085',
      date: '21/08/2026 14:30',
      expediteur: 'URSSAF Ile-de-France',
      objet: 'Notification de Cotisations T3 2026',
      priorite: 'HAUTE',
      fichier: 'courrier_084.pdf',
      statut: 'En attente de prise en charge'
    },
    {
      id: 'CR-2026-086',
      date: '21/08/2026 14:30',
      expediteur: 'URSSAF Ile-de-France',
      objet: 'Notification de Cotisations T3 2026',
      priorite: 'NORMAL',
      fichier: 'courrier_084.pdf',
      statut: 'En attente de prise en charge'
    },
    {
      id: 'CR-2026-087',
      date: '21/08/2026 14:30',
      expediteur: 'URSSAF Ile-de-France',
      objet: 'Notification de Cotisations T3 2026',
      priorite: 'NORMAL',
      fichier: 'courrier_084.pdf',
      statut: 'En attente de prise en charge'
    }
  ]);

  const [filter, setFilter] = useState('Tout');

  const getBadgePriorite = (p) => {
    switch (p) {
      case 'CRITIQUE':
        return 'bg-red-600 text-white';
      case 'HAUTE':
        return 'bg-amber-600 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const handleStatutChange = (id, newStatut) => {
    setCourriers(courriers.map(c => c.id === id ? { ...c, statut: newStatut } : c));
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-800 font-sans text-sm">
      
      {/* 1. BARRE LATÉRALE À GAUCHE */}
      <aside className="w-16 bg-slate-800 flex flex-col items-center justify-between py-4 border-r border-slate-700 shrink-0">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-white font-bold text-xl p-2 bg-blue-600 rounded-lg">G</div>
          <button className="p-2.5 text-blue-400 bg-slate-700/50 rounded-xl"><LayoutDashboard className="w-5 h-5" /></button>
          <button className="p-2.5 text-slate-400 hover:text-white transition"><Mail className="w-5 h-5" /></button>
          <button className="p-2.5 text-slate-400 hover:text-white transition"><Send className="w-5 h-5" /></button>
          <button className="p-2.5 text-slate-400 hover:text-white transition"><Inbox className="w-5 h-5" /></button>
          <button className="p-2.5 text-slate-400 hover:text-white transition"><Settings className="w-5 h-5" /></button>
        </div>
        <button className="p-2.5 text-slate-400 hover:text-white transition"><Settings className="w-5 h-5" /></button>
      </aside>

      {/* ZONE PRINCIPALE */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-200">
        
        {/* 2. BARRE SUPÉRIEURE (HEADER) */}
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
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">3</span>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-semibold">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-200">Élodie Martin (Resp. Comptabilité)</span>
            </div>
          </div>
        </header>

        {/* 3. TABLEAU DES COURRIERS (PLEINE LARGEUR) */}
        <div className="flex-1 p-4 overflow-hidden">
          <main className="h-full bg-white rounded-xl shadow-sm border border-slate-300 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-800 mb-2">Courriers Reçus de l'Accueil</h2>
              <div className="flex space-x-3 text-xs">
                {['Tout', 'Urgent', 'En cours', 'À traiter'].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`font-semibold ${filter === item ? 'text-red-600 border-b-2 border-red-600' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    [{item}]
                  </button>
                ))}
              </div>
            </div>

            {/* Tableau */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold sticky top-0">
                  <tr>
                    <th className="p-3">Date d'Arrivée (et Heure)</th>
                    <th className="p-3">Expéditeur d'Origine</th>
                    <th className="p-3">Objet</th>
                    <th className="p-3">Référence</th>
                    <th className="p-3">Priorité</th>
                    <th className="p-3">Pièce Jointe</th>
                    <th className="p-3">Statut / Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {courriers.map((c) => (
                    <tr 
                      key={c.id} 
                      className="hover:bg-slate-50 transition"
                    >
                      <td className="p-3 whitespace-nowrap text-slate-600 flex items-center gap-1.5">
                        {c.date} <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      </td>
                      <td className="p-3 font-medium text-slate-800">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {c.expediteur}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">{c.objet}</td>
                      <td className="p-3 text-slate-600">{c.id}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getBadgePriorite(c.priorite)}`}>
                          {c.priorite}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200 cursor-pointer">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-semibold text-slate-700 text-[11px]">[PDF]</span>
                          <Download className="w-3 h-3 text-slate-500 ml-1" />
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="block text-[11px] text-slate-500 mb-1">{c.statut}</span>
                        <button 
                          onClick={() => handleStatutChange(c.id, 'Pris en charge')}
                          className="px-2.5 py-1 bg-slate-200 border border-slate-300 rounded text-slate-800 hover:bg-slate-300 font-medium text-[11px]"
                        >
                          Prendre en charge
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </main>
        </div>

      </div>
    </div>
  );
}


export default Menu;