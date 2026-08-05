import { useEffect, useState } from 'react';
import Dash from './Dashbord.jsx';

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
      
      <Dash/>
    </div>
  );
}

export default App;