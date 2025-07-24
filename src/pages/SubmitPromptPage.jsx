import React from 'react';
import { useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './SubmitPromptPage.css';

const SubmitPromptPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { signed } = useAuth();

  if (!state?.bookData) {
    return <Navigate to="/" />;
  }

  const book = state.bookData;

  const handleNavigate = () => {
    if (signed) {
      navigate('/enviar-resumo', { state: { title: book.title, author: book.author } });
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="submit-prompt-page container">
      <div className="prompt-card">
        <img src={book.coverUrl} alt={`Capa de ${book.title}`} loading="lazy" className="prompt-cover" />
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