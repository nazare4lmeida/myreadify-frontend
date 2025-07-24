import React, { useState } from 'react'; // 1. Importe o useState
import { useNavigate } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ livro }) => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false); // 2. Estado para controlar o carregamento

  const getImageUrl = () => {
    // ... (sua função getImageUrl continua a mesma, sem alterações)
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
    // ... (sua função handleAction continua a mesma)
    if (livro.isPlaceholder) {
      navigate('/enviar-resumo', { state: {} });
    } else {
      navigate(`/livro/${livro.slug}`);
    }
  };

  // Esta função não é necessária, pois o card inteiro é clicável
  // const handleButtonClick = (e) => { }; 

  return (
    // Removido o onClick daqui para evitar que um clique no botão propague para o card
    <div className="book-card"> 
      {}
      <div className="book-cover-wrapper" onClick={handleAction}>
        <img 
          src={imageUrl} 
          alt={`Capa do livro ${livro.title}`} 
          loading="lazy" 
          className="book-cover"
          // 4. Esconde a imagem até carregar e adiciona a transição
          style={{ opacity: isLoaded ? 1 : 0 }} 
          // 5. Quando a imagem carregar, atualiza o estado
          onLoad={() => setIsLoaded(true)} 
        />
        {}
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