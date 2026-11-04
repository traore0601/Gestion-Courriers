import React, { useState } from 'react';
import { Mail, FileText, Download, Calendar } from 'lucide-react';

const AideSupport = () => {
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
    <div>AideSupport</div>
  );
};

export default AideSupport;