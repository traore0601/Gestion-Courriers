import { useEffect, useState } from 'react';
import Layout from './composants/Layout.jsx';
import AppRoutes from './AppRoutes.jsx';


function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/courrier/')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error("Erreur de connexion :", err));
  }, []);

  return (
    <div >

      <Layout>
      {/* AppRoutes affichera automatiquement la bonne page ici */}
      <AppRoutes />
    </Layout>

    </div>
  );
}

export default App;