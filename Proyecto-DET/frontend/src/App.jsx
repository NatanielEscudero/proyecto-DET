import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Principal from './pages/Principal';
import Formulario from './pages/Formulario';

// Componente principal de la aplicación

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route  path="/"  element={<Principal/> }/>
          <Route path="/Formulario" element={<Formulario/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;