// src/components/BookCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ livro }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (livro.isPlaceholder) {
      // --- MUDANÇA: Usa 'livro.slug' para a navegação ---
      navigate(`/proposta-resumo/${livro.slug}`, { state: { bookData: livro } });
    } else {
      navigate(`/livro/${livro.slug}`);
    }
  };

  const imageUrl = livro.full_cover_url || livro.coverUrl || 'https://via.placeholder.com/150x220.png?text=Sem+Capa';

  return (
    <div className="book-card" onClick={handleNavigate}>
      <img src={imageUrl} alt={`Capa do livro ${livro.title}`} className="book-cover" />
      <div className="book-info">
        <h3>{livro.title}</h3>
        <p>{livro.author}</p>
      </div>
      <div className="card-actions">
        <button className="btn-summary" onClick={handleNavigate}>
          {livro.isPlaceholder ? 'Enviar Resumo' : 'Ler Resumo'}
        </button>
      </div>
    </div>
  );
};

export default BookCard;