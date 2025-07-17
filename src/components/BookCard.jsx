// Em src/components/BookCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ livro }) => {
  const navigate = useNavigate();

  const handleNavigateToSummary = () => {
    navigate(`/livro/${livro.id}`);
  };

  return (
    // O card inteiro continua clicável
    <div className="book-card" onClick={handleNavigateToSummary}>
      <img src={livro.coverUrl} alt={`Capa do livro ${livro.title}`} className="book-cover" />
      <div className="book-info">
        <h3>{livro.title}</h3>
        <p>{livro.author}</p>
      </div>
      <div className="card-actions">
        {/* O botão principal agora é para ler o resumo */}
        <button className="btn-summary" onClick={handleNavigateToSummary}>Ler Resumo</button>
      </div>
    </div>
  );
};

export default BookCard;