import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import FormulaireInterne from "./courriers/FormulaireInterne.jsx";
import ListeCourriersInternes from "./courriers/ListeCourriersInternes.jsx";

function CourriersInternes() {
  const navigate = useNavigate();

  return (
    <div className="w-full space-y-4">
      <Routes>
        <Route 
          path="" 
          element={
            <ListeCourriersInternes 
              onNewClick={() => navigate("nouveau")} 
            />
          } 
        />
        <Route 
          path="nouveau" 
          element={
            <FormulaireInterne 
              onCancel={() => navigate("..")} 
              onSuccess={() => navigate("..")} 
            />
          } 
        />
      </Routes>
    </div>
  );
}

export default CourriersInternes;