// Em src/components/Header.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <NavLink to="/" className="logo-link">
          <div className="logo">
            <h1>MyReadify</h1>
            <p>Sua estante digital</p>
          </div>
        </NavLink>
        <nav className="main-nav">
          <NavLink to="/categorias">Categorias</NavLink>
          <NavLink to="/enviar-resumo">Enviar Resumo</NavLink>
          <NavLink to="/meus-resumos">Resumos</NavLink>
          <NavLink to="/sobre">Sobre</NavLink> {/* Adicione este link */}
          <NavLink to="/login" className="login-button">Login</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;