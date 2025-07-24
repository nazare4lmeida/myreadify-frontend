import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ livro }) => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

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
      navigate('/enviar-resumo', { state: {} });
    } else {
      navigate(`/livro/${livro.slug}`);
    }
  };

  return (
    <div className="book-card">
      <div className="book-cover-wrapper" onClick={handleAction}>
        <img 
          src={imageUrl} 
          alt={`Capa do livro ${livro.title}`} 
          loading="lazy"
          width={200}
          height={300}
          className="book-cover"
          style={{ opacity: isLoaded ? 1 : 0 }}
          onLoad={() => setIsLoaded(true)}
        />
        {!isLoaded && <div className="skeleton-loader"></div>}
      </div>

      <div className="book-info" onClick={handleAction}>
        <h3>{livro.title}</h3>
        <p>{livro.author}</p>
      </div>

      <div className="card-actions">
        <button className="btn-summary" onClick={handleAction}>
          {livro.isPlaceholder ? 'Enviar Resumo' : 'Ler Resumo'}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
