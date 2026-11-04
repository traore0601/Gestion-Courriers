import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppRoutes from './AppRoutes.jsx';
import LoginPage from './LoginPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<AppRoutes />} />
    </Routes>
  );
}

export default App;