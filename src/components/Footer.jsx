// Em src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 1. Importe o hook de autenticação
import './Footer.css';

const Footer = () => {
  const { signed } = useAuth(); // 2. Pegue o status de login do usuário
  const githubRepoUrl = 'https://github.com/nazare4lmeida/myreadify-frontend';
  const currentYear = new Date().getFullYear(); // Pega o ano atual dinamicamente

  return (
    <footer className="app-footer">
      <div className="footer-content container">
        {/* --- Seção da Marca (Esquerda) --- */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">MyReadify</Link>
          <p className="footer-tagline">Sua estante de livros digital.</p>
          <div className="footer-socials">
            {/* Ícones... */}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069s-3.584-.011-4.85-.069c-3.252-.149-4.771-1.664-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg>
            </a>
          </div>
        </div>

        {/* --- Seção de Links (Direita) --- */}
        <div className="footer-links-container">
          <div className="footer-column">
            <h4>Navegação</h4>
            <Link to="/categorias">Categorias</Link>
            {/* 3. Lógica condicional: só mostra se estiver logado */}
            {signed && (
              <>
                <Link to="/enviar-resumo">Enviar um Resumo</Link>
                <Link to="/meus-downloads">Meus Downloads</Link>
              </>
            )}
          </div>
          <div className="footer-column">
            <h4>Sobre</h4>
            <Link to="/sobre">O MyReadify</Link>
            <a href={githubRepoUrl} target="_blank" rel="noopener noreferrer">GitHub do Projeto</a>
            {/* 4. Lógica condicional: só mostra se NÃO estiver logado */}
            {!signed && (
              <Link to="/login">Login / Cadastro</Link>
            )}
          </div>
        </div>
      </div>
      
      {/* 5. NOVA SEÇÃO DE COPYRIGHT */}
      <div className="footer-copyright">
        © {currentYear} MyReadify. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;