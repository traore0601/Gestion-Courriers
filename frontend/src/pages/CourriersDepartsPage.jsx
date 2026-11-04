import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import FormulaireSortant from "./courriers/FormulaireSortant.jsx";
import ListeCourriersSortants from "./courriers/ListeCourriersSortants.jsx";

function CourriersDeparts() {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-4">
      <Routes>
        <Route 
          path="" 
          element={
            <ListeCourriersSortants 
              onNewClick={() => navigate("nouveau")} 
            />
          } 
        />
        <Route 
          path="nouveau" 
          element={
            <FormulaireSortant 
              onCancel={() => navigate("..")} 
              onSuccess={() => navigate("..")} 
            />
          } 
        />
      </Routes>
    </div>
  );
}

export default CourriersDeparts;