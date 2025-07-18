// src/components/BookCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ livro }) => {
  const navigate = useNavigate();

  const handleNavigateToSummary = () => {
    navigate(`/livro/${livro.id}`);
  };

  // Se o livro vier da API, ele terá 'full_cover_url'.
  // Se vier do mock, usamos o 'coverUrl' que já existia.
  const imageUrl = livro.full_cover_url || livro.coverUrl || 'https://via.placeholder.com/150x220.png?text=Sem+Capa';

  return (
    <div className="book-card" onClick={handleNavigateToSummary}>
      <img src={imageUrl} alt={`Capa do livro ${livro.title}`} className="book-cover" />
      <div className="book-info">
        <h3>{livro.title}</h3>
        <p>{livro.author}</p>
      </div>
      <div className="card-actions">
        <button className="btn-summary" onClick={handleNavigateToSummary}>Ler Resumo</button>
      </div>
    </div>
  );
};

export default BookCard;