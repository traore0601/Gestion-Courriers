import { useState } from 'react';

function FormulaireEntrant() {
  const initialFormState = {
    confidentialite: false, 
    numero_ordre: '',
    reference: '',
    date: '',
    objet: '',
    nom_expediteur: '',
    fonction_expediteur: '',
    structure_expediteur: '',
    ville_expediteur: '',
    signataire: '',
    structure_signataire: '',
    delai_de_reponse: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 
  const toggleConfidentialite = () => {
    setFormData((prev) => ({
      ...prev,
      confidentialite: !prev.confidentialite,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

   
    const payload = {
      ...formData,
      delai_de_reponse: formData.delai_de_reponse || null,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/courriers-entrants/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Courrier enregistré avec succès !');
        setFormData(initialFormState);
      } else {
        const dataErrors = await response.json();
        console.error("Détail des erreurs Django REST :", dataErrors);
        setErrors(dataErrors);
      }
    } catch (error) {
      console.error("Erreur lors de la communication avec l'API :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
<div className="space-y-2">
           <div className='flex  space-x-10 mx-auto'>  
    <div >
      <div >
        <label htmlFor="numero_ordre" className='text-black font-bold block  text-sm '>Numéro d'ordre :</label>
        <input id="numero_ordre" type="text" name="numero_ordre" value={formData.numero_ordre} onChange={handleChange} className=" w-97  rounded border border-gray-400 outline-none "/>
        {errors.numero_ordre && <p style={{ color: 'red' }}>{errors.numero_ordre[0]}</p>}
      </div>

      <div>
        <label htmlFor="reference" className=' font-bold text-black block  text-sm'>Référence :</label>
        <input id="reference" type="text" name="reference" value={formData.reference} onChange={handleChange}  className=" w-97  rounded border border-gray-900 outline-none" />
        {errors.reference && <p style={{ color: 'red' }}>{errors.reference[0]}</p>}
      </div>

      <div >
        <label htmlFor="date" className=' font-bold text-black block  text-sm'>Date du courrier :</label>
        <input id="date" type="date" name="date" value={formData.date} onChange={handleChange} className=" w-97  rounded border border-gray-400 outline-none " />
        {errors.date && <p style={{ color: 'red' }}>{errors.date[0]}</p>}
      </div>

      <div>
        <label htmlFor="objet" className=' font-bold text-black block  text-sm '>Objet :</label>
        <textarea name="objet" id="objet" value={formData.objet} onChange={handleChange} className="   rounded border border-gray-400 outline-none w-48"></textarea>
        {/*<input id="objet" type="text" name="objet" value={formData.objet} onChange={handleChange} className="   rounded border border-gray-400 outline-none "/>*/}
        {errors.objet && <p style={{ color: 'red' }}>{errors.objet[0]}</p>}
      </div>

      <div>
        <label htmlFor="nom_expediteur" className=' font-bold text-black block  text-sm'>Nom Expéditeur :</label>
        <input id="nom_expediteur" type="text" name="nom_expediteur" value={formData.nom_expediteur} onChange={handleChange} className=" w-97 rounded border border-gray-400 outline-none "/>
        {errors.nom_expediteur && <p style={{ color: 'red' }}>{errors.nom_expediteur[0]}</p>}
      </div>

      <div>
        <label htmlFor="fonction_expediteur" className=' font-bold text-black block  text-sm'>Fonction Expéditeur :</label>
        <input id="fonction_expediteur" type="text" name="fonction_expediteur" value={formData.fonction_expediteur} onChange={handleChange} className=" w-97  rounded border border-gray-400 outline-none "/>
        {errors.fonction_expediteur && <p style={{ color: 'red' }}>{errors.fonction_expediteur[0]}</p>}
      </div>
    </div>

    <div>
        <div>
        <label htmlFor="structure_expediteur" className=' font-bold text-black block  text-sm'>Structure Expéditeur :</label>
        <input id="structure_expediteur" type="text" name="structure_expediteur" value={formData.structure_expediteur} onChange={handleChange} className=" w-97  rounded border border-gray-400 outline-none "/>
        {errors.structure_expediteur && <p >{errors.structure_expediteur[0]}</p>}
      </div>

      <div>
        <label htmlFor="ville_expediteur"  className=' font-bold text-black block  text-sm'>Ville Expéditeur :</label>
        <input id="ville_expediteur" type="text" name="ville_expediteur" value={formData.ville_expediteur} onChange={handleChange} className=" w-97  rounded border border-gray-400 outline-none "/>
        {errors.ville_expediteur && <p >{errors.ville_expediteur[0]}</p>}
      </div>

      <div >
        <label htmlFor="signataire" className=' font-bold text-black block  text-sm'>Signataire :</label>
        <input id="signataire" type="text" name="signataire" value={formData.signataire} onChange={handleChange} className=" w-97  rounded border border-gray-400 outline-none "/>
        {errors.signataire && <p style={{ color: 'red' }}>{errors.signataire[0]}</p>}
      </div>

      <div>
        <label htmlFor="structure_signataire" className=' font-bold text-black block  text-sm'>Structure Signataire :</label>
        <input id="structure_signataire" type="text" name="structure_signataire" value={formData.structure_signataire} onChange={handleChange} className=" w-97  rounded border border-gray-400 outline-none "/>
        {errors.structure_signataire && <p style={{ color: 'red' }}>{errors.structure_signataire[0]}</p>}
      </div>

      <div >
        <label htmlFor="delai_de_reponse" className=' font-bold text-black block  text-sm'>Délai de réponse :</label>
        <input id="delai_de_reponse" type="date" name="delai_de_reponse" value={formData.delai_de_reponse} onChange={handleChange} className=" w-97  rounded border border-gray-400 outline-none "/>
        {errors.delai_de_reponse && <p style={{ color: 'red' }}>{errors.delai_de_reponse[0]}</p>}
      </div>

      {/*BOUTON TOGGLE CONFIDENTIALITÉ */}
      <div style={{ margin: '15px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <label  className=' font-bold text-black'>Confidentiel :</label>
        <button
          type="button" 
          onClick={toggleConfidentialite}
          style={{
            padding: '6px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
            backgroundColor: formData.confidentialite ? '#dc2626' : '#e5e7eb',
            color: formData.confidentialite ? '#ffffff' : '#374151',
            transition: 'background-color 0.2s ease',
          }}
        >
          {formData.confidentialite ? 'Oui' : 'Non'}
        </button>
        {errors.confidentialite && <p style={{ color: 'red' }}>{errors.confidentialite[0]}</p>}
      </div>
    </div>
</div>  
      <button type="submit">Enregistrer</button>
</div>
    </form>
  );
}

export default FormulaireEntrant;