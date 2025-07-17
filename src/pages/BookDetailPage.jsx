// src/pages/BookDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './BookDetailPage.css'; // Importaremos um CSS novo para as avaliações

const BookDetailPage = () => {
  const { id } = useParams();
  const [livro, setLivro] = useState(null);
  // 1. Criamos um novo estado para guardar as avaliações
  const [reviews, setReviews] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Usamos Promise.all para fazer as duas chamadas à API em paralelo
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const bookPromise = api.get(`/books/${id}`); // Prepara a chamada do livro
        const reviewsPromise = api.get(`/books/${id}/reviews`); // Prepara a chamada das avaliações

        // Espera as duas chamadas terminarem
        const [bookResponse, reviewsResponse] = await Promise.all([bookPromise, reviewsPromise]);

        setLivro(bookResponse.data);
        setReviews(reviewsResponse.data);

      } catch (err) {
        setError('Livro não encontrado ou não disponível.');
        console.error("Falha ao buscar dados:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (isLoading) return <div className="container"><p>Carregando...</p></div>;
  if (error) return <div className="container"><p>{error} <Link to="/categorias">Voltar</Link></p></div>;
  if (!livro) return null;

  return (
    <div className="book-detail-page">
      <div className="book-detail-content">
        {/* ... (código da capa e detalhes do livro, que continua igual) ... */}
        <img src={livro.cover_url} alt={`Capa de ${livro.title}`} className="book-detail-cover" />
        <div className="book-detail-info">
            <h1>{livro.title}</h1>
            {/* ... (outros detalhes do livro) ... */}
            <p className="book-summary-text">{livro.summary}</p>
        </div>
      </div>

      {/* --- SEÇÃO DE AVALIAÇÕES E COMENTÁRIOS --- */}
      <div className="reviews-section">
        <h3>Avaliações dos Leitores</h3>
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <span className="review-author">{review.user.name}</span>
                  <span className="review-rating">
                    {/* Cria '★' para a nota e '☆' para o restante */}
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Este livro ainda não tem avaliações. Seja o primeiro a comentar!</p>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;