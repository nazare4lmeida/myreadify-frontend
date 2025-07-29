// src/pages/SubmitPromptPage.jsx
import React from 'react';
import { useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './SubmitPromptPage.css';
import { getImageUrl } from '../utils/imageUtils'; // Importe a nova função utilitária

const SubmitPromptPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { signed } = useAuth();

  // CORREÇÃO: Garante que o objeto 'book' seja acessado corretamente do estado
  if (!state?.book) { 
    return <Navigate to="/" />;
  }

  const book = state.book;

  const handleNavigate = () => {
    if (signed) {
      // CORREÇÃO: Passa o objeto 'book' completo para a página de envio de resumo
      navigate('/enviar-resumo', { state: { book: book } });
    } else {
      navigate('/login');
    }
  };

  // CORREÇÃO: Use a função centralizada para obter a URL da imagem
  const coverImage = getImageUrl(book); 

  return (
    <div className="submit-prompt-page container">
      <div className="prompt-card">
        <img
          src={coverImage} // Use a URL resolvida
          alt={`Capa de ${book.title}`}
          loading="lazy"
          className="prompt-cover"
        />
        <div className="prompt-info">
          <h1>{book.title}</h1>
          <p className="prompt-message">Este livro ainda não possui um resumo em nossa biblioteca.</p>
          <h2>Gostaria de ser o primeiro a enviar?</h2>
          <button onClick={handleNavigate} className="btn-prompt">
            {signed ? 'Sim, quero enviar um resumo!' : 'Faça Login para Enviar'}
          </button>
          <Link to="/categorias" className="back-link">Voltar para a biblioteca</Link>
        </div>
      </div>
    </div>
  );
};

export default SubmitPromptPage;
