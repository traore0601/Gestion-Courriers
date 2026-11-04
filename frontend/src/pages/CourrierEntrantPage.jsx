import { Routes, Route, useNavigate } from 'react-router-dom';
import FormulaireEntrant from "./courriers/FormulaireEntrant.jsx";
import ListeCourriersEntrants from "./courriers/ListeCourriersEntrants.jsx";

function CourriersEntrant() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route 
        path="" 
        element={
          <ListeCourriersEntrants
            onNewClick={() => navigate("nouveau")} 
          />
        } 
      />
      <Route 
        path="nouveau" 
        element={
          <FormulaireEntrant
            onCancel={() => navigate("..")} 
            onSuccess={() => navigate("..")} 
          />
        } 
      />
    </Routes>
  );
}

export default CourriersEntrant;