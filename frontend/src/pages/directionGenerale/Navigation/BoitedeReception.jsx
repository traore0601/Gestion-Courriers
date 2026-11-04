import React, { useState, useEffect } from 'react';
import { Mail, FileText, Download, Calendar, Loader } from 'lucide-react';
import { authFetch } from '../../api/apiClient.js';
import { useAuth } from '../../context/AuthContext.jsx';

const BoitedeReception = () => {
  const [courriers, setCourriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Tout');
  const { user } = useAuth();

  useEffect(() => {
    fetchCourriersRecus();
  }, []);

  const fetchCourriersRecus = async () => {
    setLoading(true);
    try {
      const response = await authFetch('http://127.0.0.1:8000/api/courriers-entrants/');
      if (response.ok) {
        const data = await response.json();
        setCourriers(data);
      } else {
        console.error("Erreur lors de la récupération des courriers");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgePriorite = (p) => {
    switch (p?.toLowerCase()) {
      case 'tres_urgente':
      case 'urgente':
        return 'bg-red-600 text-white';
      case 'importante':
        return 'bg-amber-600 text-white';
      default:
        return 'bg-blue-600 text-white';
    }
  };

  const isAmpliateur = (courrier) => {
    if (!user || !user.personnel) return false;
    return courrier.ampliateurs_details?.some(
      (amp) => amp.personnel === user.personnel
    );
  };

  // Filtrage selon l'onglet
  const filteredCourriers = courriers.filter((c) => {
    if (filter === 'Urgent') return c.priorite === 'urgente' || c.priorite === 'tres_urgente';
    if (filter === 'En cours') return c.statut === 'en_cours';
    if (filter === 'À traiter') return c.statut === 'a_assigner' || c.statut === 'arrive';
    return true;
  });

  return (
    <div className="w-full">
      <main className="w-full">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-800 mb-2">
            Courriers Reçus
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
          {loading ? (
            <div className="flex justify-center items-center p-8 text-slate-500 gap-2">
              <Loader className="w-5 h-5 animate-spin" />
              <span>Chargement des courriers reçus...</span>
            </div>
          ) : filteredCourriers.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              Aucun courrier trouvé pour cette sélection.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold sticky top-0">
                <tr>
                  <th className="p-3">Date du Courrier</th>
                  <th className="p-3">Expéditeur</th>
                  <th className="p-3">Objet</th>
                  <th className="p-3">Numéro d'Ordre / Réf.</th>
                  <th className="p-3">Rôle</th>
                  <th className="p-3">Priorité</th>
                  <th className="p-3">Pièces Jointes</th>
                  <th className="p-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredCourriers.map((c) => {
                  const enCopie = isAmpliateur(c);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="p-3 whitespace-nowrap text-slate-600">
                        <span className="flex items-center gap-1.5">
                          {c.date} <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-800">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" /> {c.nom_expediteur} ({c.structure_expediteur || 'N/A'})
                        </span>
                      </td>
                      <td className="p-3 text-slate-700 font-medium">{c.objet}</td>
                      <td className="p-3 text-slate-600">{c.numero_ordre}</td>
                      <td className="p-3">
                        {enCopie ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                            Ampliateur (Copie)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">
                            Destinataire
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getBadgePriorite(c.priorite)}`}>
                          {c.priorite_display || c.priorite}
                        </span>
                      </td>
                      <td className="p-3">
                        {c.pieces_jointes && c.pieces_jointes.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {c.pieces_jointes.map((pj) => (
                              <a
                                key={pj.id}
                                href={pj.url_complete}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200 cursor-pointer text-[10px]"
                              >
                                <FileText className="w-3 h-3 text-blue-600" />
                                <span className="font-semibold text-slate-700 truncate max-w-[100px]">{pj.nom_original}</span>
                                <Download className="w-3 h-3 text-slate-500" />
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Aucune</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="block text-[11px] text-slate-600 font-medium">
                          {c.statut_display || c.statut}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default BoitedeReception;