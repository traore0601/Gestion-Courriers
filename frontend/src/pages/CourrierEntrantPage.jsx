import { useState } from 'react';
import FormulaireEntrant from "./courriers/FormulaireEntrant.jsx";
import FormulaireSortant from "./courriers/FormulaireSortant.jsx";

function CourriersEntrant() {
  return (
    <div className="w-full space-y-2">
      {/* En-tête compact */}
      <div>
        <h1 className="text-lg font-bold text-gray-800">Gestion des Courriers Arrivés</h1>
        <p className="text-xs text-gray-500">Saisissez les informations des courriers entrants reçus par la structure.</p>
      </div>

      {/* Formulaire d'enregistrement */}
      <FormulaireEntrant />
    </div>
  );
}

export default CourriersEntrant;