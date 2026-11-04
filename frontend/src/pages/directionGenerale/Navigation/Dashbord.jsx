import React from 'react';
import { 
  Inbox, 
  Send, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowUpRight, 
  TrendingUp,
  UserCheck
} from 'lucide-react';

const Dashbord = () => {
  // Données fictives pour la synthèse
  const stats = [
    { label: 'Courriers Reçus (Ce mois)', value: '142', change: '+12%', icon: Inbox, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'En attente d\'annotation', value: '18', change: 'Urgent', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Projets signés / clôturés', value: '89', change: '+8%', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Courriers Sortants', value: '35', change: '+5%', icon: Send, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  // Courriers en attente d'action prioritaire de la DG
  const courriersPrioritaires = [
    {
      id: 'CR-2026-089',
      expediteur: 'Ministère de la Transition Numérique',
      objet: 'Demande de rapport d\'avancement du projet e-Courrier',
      date: '17 Sept 2026',
      priorite: 'Haute',
      statut: 'À annoter',
    },
    {
      id: 'CR-2026-085',
      expediteur: 'Société Nationale d\'Électricité',
      objet: 'Avenant au contrat de prestation de service 2026',
      date: '16 Sept 2026',
      priorite: 'Moyenne',
      statut: 'À signer',
    },
    {
      id: 'CR-2026-078',
      expediteur: 'Banque d\'Investissement',
      objet: 'Notification de validation du budget d\'équipement',
      date: '15 Sept 2026',
      priorite: 'Basse',
      statut: 'Pour information',
    },
  ];

  // Activité récente des services
  const activitesServices = [
    { service: 'Direction Technique', action: 'A soumis un projet de réponse', dossier: 'Projet d\'interconnexion', heure: 'Il y a 10 min' },
    { service: 'Service Juridique', action: 'A validé le courrier entrant', dossier: 'CR-2026-085', heure: 'Il y a 45 min' },
    { service: 'Secrétariat Général', action: 'A transmis 3 nouveaux courriers', dossier: 'Lot du matin', heure: 'Il y a 2h' },
  ];

  return (
    <div className="w-full space-y-6 pb-6">
      {/* En-tête de bienvenue */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Bienvenue, Monsieur le Directeur Général</h1>
          <p className="text-blue-100 text-sm mt-1">
            Voici la synthèse globale du flux de courrier et des actions nécessitant votre validation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm transition border border-white/20">
            Générer un rapport
          </button>
        </div>
      </div>

      {/* Cartes Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${item.bg}`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">
                  {item.change}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-slate-800">{item.value}</h3>
                <p className="text-xs text-slate-500 mt-1">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section Principale (Tableau & Activités) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tableau des courriers urgents (2/3 de l'espace) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-800">Courriers nécessitant une action</h2>
            </div>
            <button className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
              Voir tout <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-semibold">
                  <th className="py-3 px-2">RÉFÉRENCE</th>
                  <th className="py-3 px-2">EXPÉDITEUR & OBJET</th>
                  <th className="py-3 px-2">PRIORITÉ</th>
                  <th className="py-3 px-2">STATUT</th>
                  <th className="py-3 px-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {courriersPrioritaires.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-2 font-semibold text-slate-700">{item.id}</td>
                    <td className="py-3.5 px-2 max-w-xs">
                      <p className="font-semibold text-slate-800 truncate">{item.expediteur}</p>
                      <p className="text-slate-500 truncate">{item.objet}</p>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.priorite === 'Haute' 
                          ? 'bg-red-50 text-red-600' 
                          : item.priorite === 'Moyenne' 
                          ? 'bg-amber-50 text-amber-600' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.priorite}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="font-medium text-slate-600">{item.statut}</span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <button className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-medium rounded-lg transition">
                        Traiter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fil d'activité des services (1/3 de l'espace) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-800">Activité des Directions</h2>
          </div>

          <div className="space-y-4 flex-1">
            {activitesServices.map((act, index) => (
              <div key={index} className="flex gap-3 text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-600 h-fit mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="font-bold text-slate-800">{act.service}</span>
                  <p className="text-slate-600">{act.action}</p>
                  <p className="text-slate-400 font-mono text-[10px] mt-0.5">{act.dossier}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{act.heure}</span>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium text-xs rounded-xl transition">
            Voir le journal d'audits
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashbord;