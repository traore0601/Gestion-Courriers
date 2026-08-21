import React from 'react';

function CourriersInternes() {
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Courriers Internes</h1>
          <p className="text-sm text-gray-500">Gestion des notes de service et mémorandums internes.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Créer une note interne
        </button>
      </div>
      
      <div className="bg-white p-8 border border-dashed border-gray-300 rounded-xl text-center text-gray-500">
        Tableau des courriers internes en cours de construction.
      </div>
    </div>
  );
}

export default CourriersInternes;