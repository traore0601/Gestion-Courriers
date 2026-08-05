
import {  useState } from 'react';
import FormulaireEntrant from "./courriers/FormulaireEntrant.jsx";
import Layout from "./composants/Layout.jsx";
import FormulaireSortant from "./courriers/FormulaireSortant.jsx";
function CourierEntrant() {
  
  return (
    <div className='flex flex-1'>
     
<Layout>
      <FormulaireEntrant />
    </Layout>
        
    </div>
  );
}

export default CourierEntrant;