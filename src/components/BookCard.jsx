import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ livro }) => {
  const navigate = useNavigate();

  const getImageUrl = () => {
    if (livro.coverUrl) {
      return livro.coverUrl;
    }
    if (livro.cover_url) {
      return `http://localhost:3333/files/${livro.cover_url}`;
    }

    return 'https://via.placeholder.com/150x220.png?text=Sem+Capa';
  };

  const imageUrl = getImageUrl();

  const handleAction = () => {
    if (livro.isPlaceholder) {
      navigate('/enviar-resumo', { state: { } });
    } else {
      navigate(`/livro/${livro.slug}`);
    }
  };

  const handleButtonClick = (e) => { };

  return (
    <div className="book-card" onClick={handleAction}>
      <img src={imageUrl} alt={`Capa do livro ${livro.title}`} className="book-cover" />
      <div className="book-info">
        <h3>{livro.title}</h3>
        <p>{livro.author}</p>
      </div>
      <div className="card-actions">
        <button className="btn-summary" onClick={handleButtonClick}>
          {livro.isPlaceholder ? 'Enviar Resumo' : 'Ler Resumo'}
        </button>
      </div>
    </div>
  );
};

export default BookCard;