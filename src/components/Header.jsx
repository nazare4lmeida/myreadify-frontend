import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { signed, user, signOut } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    signOut();
    setDropdownOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


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
          <div className="nav-links">
            <div className="nav-item">
              <NavLink to="/">Início</NavLink>
            </div>
            <div className="nav-item">
              <NavLink to="/categorias">Categorias</NavLink>
            </div>
            <div className="nav-item">
              <NavLink to="/enviar-resumo">Enviar Resumo</NavLink>
            </div>
            <div className="nav-item">
              <NavLink to="/sobre">Sobre</NavLink>
            </div>
          </div>

          <div className="nav-profile">
            {signed ? (
              <div className="profile-menu" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="profile-button"
                >
                  {/* CORREÇÃO 1: Alterado para 'admin' (minúsculas) */}
                  <span className="profile-name">Olá, {user?.role === 'admin' ? 'Admin' : user.name.split(' ')[0]}</span>
                  <span className={`arrow-down ${dropdownOpen ? 'open' : ''}`}>▼</span>
                </button>
                {dropdownOpen && (
                  <div className="dropdown-content">
                    {/* CORREÇÃO 2: Alterado para 'admin' (minúsculas) */}
                    {user?.role === 'admin' && (
                      <>
                        <NavLink to="/admin/aprovacoes" onClick={() => setDropdownOpen(false)}>
                          <span className="dropdown-icon">✓</span> Aprovações
                        </NavLink>
                        <NavLink to="/admin/mensagens" onClick={() => setDropdownOpen(false)}>
                          <span className="dropdown-icon">✉️</span> Caixa de Entrada
                        </NavLink>
                      </>
                    )}
                    <NavLink to="/meus-resumos" onClick={() => setDropdownOpen(false)}>
                      <span className="dropdown-icon">📖</span> Meus Resumos
                    </NavLink>
                    <NavLink to="/minhas-avaliacoes" onClick={() => setDropdownOpen(false)}>
                      <span className="dropdown-icon">★</span> Minhas Avaliações
                    </NavLink>
                    <button onClick={handleLogout} className="logout-button">Sair</button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="login-button-outline">Login</NavLink>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;