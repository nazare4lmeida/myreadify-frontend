import React from 'react';
// Importa o Link para navegação interna sem recarregar a página
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
          <NavLink to="/enviar-livro">Enviar Livro</NavLink>
          <NavLink to="/meus-downloads">Meus Downloads</NavLink>
          <NavLink to="/login" className="login-button">Login</NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;