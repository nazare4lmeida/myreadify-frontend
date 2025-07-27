import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ livro }) => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  const imageUrl = livro.cover_url || 'https://via.placeholder.com/200x300.png?text=Sem+Capa';

  const handleAction = () => {
    // CORREÇÃO PRINCIPAL AQUI:
    // Só navega se o livro tiver um slug definido.
    if (livro.slug) {
      navigate(`/livro/${livro.slug}`);
    } else {
      // Se não houver slug, podemos avisar no console para ajudar a depurar.
      console.error("Tentativa de navegar para um livro sem slug:", livro);
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
          {/* A lógica do texto do botão pode continuar a mesma */}
          {livro.isPlaceholder ? 'Ver Detalhes' : 'Ler Resumo'}
        </button>
      </div>
    </div>
  );
};

export default BookCard;