import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User, 
  Mail, 
  Calendar, 
  Tag, 
  MessageSquare,
  ArrowDownLeft
} from 'lucide-react';

function Menu() {
  // Données fictives simulant un courrier reçu depuis le backend
  const [courrier, setCourrier] = useState({
    id: 'CR-2026-084',
    expediteur: 'Secrétariat Général (Mme Sako)',
    emailExpediteur: 'secretariat@entreprise.com',
    typeCourrier: 'Officiel',
    dateEnvoi: '2026-08-21',
    priorite: 'Haute',
    objet: 'Transmission de la note de cadrage du projet Gestion de Courrier',
    message: 'Veuillez trouver ci-joint le document récapitulatif validé par la direction. Merci d\'en accuser réception dès consultation.',
    fichier: {
      nom: 'Note_de_cadrage_Projet.pdf',
      taille: '2.4 Mo',
      url: '#'
    },
    statut: 'En attente' // 'En attente', 'Reçu', 'Traité'
  });

  const [observation, setObservation] = useState('');
  const [actionDone, setActionDone] = useState(false);

  const handleAccuserReception = (statutFinal) => {
    setCourrier((prev) => ({ ...prev, statut: statutFinal }));
    setActionDone(true);
    setTimeout(() => setActionDone(false), 4000);
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-xl shadow-md border border-slate-100">
      
      {/* En-tête de l'interface */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <ArrowDownLeft className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-800">Courrier Reçu #{courrier.id}</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">Espace Destinataire / Consultation</p>
        </div>

        {/* Badge de statut */}
        <div className="flex items-center gap-2">
          {courrier.statut === 'En attente' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-3.5 h-3.5" /> Non accusé
            </span>
          )}
          {courrier.statut === 'Reçu' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle className="w-3.5 h-3.5" /> Réception confirmée
            </span>
          )}
        </div>
      </div>

      {/* Alerte de confirmation d'action */}
      {actionDone && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-medium">Accusé de réception enregistré avec succès !</span>
        </div>
      )}

      {/* Métadonnées Expéditeur & Fiche Courrier */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200/60 mb-6 text-sm">
        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <p className="text-xs text-slate-500">Expéditeur</p>
            <p className="font-semibold text-slate-700">{courrier.expediteur}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <p className="text-xs text-slate-500">Date de transmission</p>
            <p className="font-semibold text-slate-700">{courrier.dateEnvoi}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tag className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <p className="text-xs text-slate-500">Type & Priorité</p>
            <p className="font-semibold text-slate-700">{courrier.typeCourrier} ({courrier.priorite})</p>
          </div>
        </div>
      </div>

      {/* Contenu du Courrier */}
      <div className="space-y-4 mb-6">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Objet</h3>
          <p className="text-base font-semibold text-slate-800">{courrier.objet}</p>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Message d'accompagnement</h3>
          <p className="text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-100 leading-relaxed">
            {courrier.message}
          </p>
        </div>

        {/* Aperçu et Téléchargement du Document */}
        {courrier.fichier && (
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Pièce Jointe</h3>
            <div className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-blue-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{courrier.fichier.nom}</p>
                  <p className="text-xs text-slate-500">{courrier.fichier.taille}</p>
                </div>
              </div>
              <a
                href={courrier.fichier.url}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5" /> Télécharger
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Section Action Destinataire / Accusé de réception */}
      {courrier.statut === 'En attente' && (
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-600" />
            Traiter le courrier
          </h3>

          <div className="mb-4">
            <label htmlFor="observation" className="block text-xs font-medium text-slate-600 mb-1">
              Note d'observation (optionnel)
            </label>
            <textarea
              id="observation"
              rows="2"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ajouter une remarque ou consigne sur ce courrier..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
            ></textarea>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleAccuserReception('Reçu')}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow transition flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Accuser Réception
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Menu;