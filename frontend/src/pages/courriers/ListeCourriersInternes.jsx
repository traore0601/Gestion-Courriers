import React from 'react';

function ListeCourriersInternes() {
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Courriers Internes</h1>
          <p className="text-sm text-gray-500">Enregistrement des courriers expédiés.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          + Nouveau courrier départ
        </button>
      </div>

      <div className="bg-white p-8 border border-dashed border-gray-300 rounded-xl text-center text-gray-500">
        Formulaire et tableau des courriers sortants.
      </div>
    </div>
  );
}

export default ListeCourriersInternes;