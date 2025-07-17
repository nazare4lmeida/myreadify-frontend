// Em src/components/BookCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Para a navegação
import './BookCard.css';

const BookCard = ({ livro }) => {
  const navigate = useNavigate();

  // Função para navegar para a página de detalhes do livro
  const handleSeeMore = () => {
    navigate(`/livro/${livro.id}`);
  };

  const handleDownload = (e) => {
    // Impede que o clique no botão também acione o handleSeeMore do card inteiro
    e.stopPropagation();
    alert(`Iniciando download de "${livro.title}" (função a ser implementada)`);
  };

  return (
    // O card inteiro agora também é clicável para ver mais detalhes
    <div className="book-card" onClick={handleSeeMore}>
      <img src={livro.coverUrl} alt={`Capa do livro ${livro.title}`} className="book-cover" />
      <div className="book-info">
        <h3>{livro.title}</h3>
        <p>{livro.author}</p>
      </div>
      <div className="card-actions">
        <button className="btn-download" onClick={handleDownload}>Download</button>
        <button className="btn-see-more" onClick={handleSeeMore}>Ver Mais</button>
      </div>
    </div>
  );
};

export default BookCard;