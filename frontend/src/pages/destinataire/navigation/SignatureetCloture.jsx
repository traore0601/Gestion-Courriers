import React, { useState } from 'react';
import { Mail, FileText, Download, Calendar } from 'lucide-react';

const SignatureetCloture = () => {
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
    <div className="">
      <main className="">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-800 mb-2">
            Courriers Reçus de l'Accueil
          </h2>
          <div className="flex space-x-3 text-xs">
            {['Tout', 'Urgent', 'En cours', 'À traiter'].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`font-semibold ${
                  filter === item 
                    ? 'text-red-600 border-b-2 border-red-600' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
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
                <tr key={c.id} className="hover:bg-slate-50 transition">
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
  );
};

export default SignatureetCloture ;