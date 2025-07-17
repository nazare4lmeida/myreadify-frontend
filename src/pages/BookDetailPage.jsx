// Em src/pages/BookDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockLivros } from '../data/mockData';
import './BookDetailPage.css';

const BookDetailPage = () => {
  // Pega o parâmetro 'id' da URL (ex: /livro/2)
  const { id } = useParams();
  
  // Encontra o livro correspondente no nosso array de dados
  // Usamos '==' porque o id da URL vem como string
  const livro = mockLivros.find(l => l.id == id);

  // Se o livro não for encontrado, mostra uma mensagem
  if (!livro) {
    return (
      <div>
        <h2>Livro não encontrado</h2>
        <Link to="/categorias">Voltar para a biblioteca</Link>
      </div>
    );
  }

  return (
    <div className="book-detail-page">
      <div className="book-detail-content">
        <img src={livro.coverUrl} alt={`Capa de ${livro.title}`} className="book-detail-cover" />
        <div className="book-detail-info">
          <h1>{livro.title}</h1>
          <h2>por {livro.author}</h2>
          <span className="category-tag">{livro.category}</span>
          <h3>Descrição</h3>
          <p>{livro.description}</p>
          <button className="btn-download-detail">Fazer Download (epub/mobi)</button>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;