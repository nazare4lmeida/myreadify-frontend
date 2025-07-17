// src/pages/MyReviewsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext'; // Para saber se o usuário está logado
import './MyReviewsPage.css'; // Criaremos este CSS

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { signed } = useAuth(); // Pegamos o status de login do contexto

  useEffect(() => {
    // Só faz a busca na API se o usuário estiver logado
    if (signed) {
      api.get('/reviews/my-reviews') // Chama nossa rota protegida
        .then(response => {
          setReviews(response.data);
        })
        .catch(error => {
          console.error("Falha ao buscar minhas avaliações:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [signed]); // O efeito roda novamente se o status de 'signed' mudar

  if (isLoading) {
    return <div className="container"><p>Carregando suas avaliações...</p></div>;
  }

  return (
    <div className="my-reviews-page">
      <h2>Minhas Avaliações</h2>
      {reviews.length > 0 ? (
        <div className="my-reviews-container">
          {reviews.map(review => (
            <div key={review.id} className="my-review-card">
              <Link to={`/livro/${review.book.id}`}>
                <img
                  src={review.book.cover_url}
                  alt={`Capa de ${review.book.title}`}
                  className="my-review-cover"
                />
              </Link>
              <div className="my-review-details">
                <Link to={`/livro/${review.book.id}`}>
                  <h3>{review.book.title}</h3>
                </Link>
                <p className="my-review-rating">
                  {'★'.repeat(review.rating)}
                  {'☆'.repeat(5 - review.rating)}
                </p>
                <p className="my-review-comment">"{review.comment}"</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Você ainda não fez nenhuma avaliação. Explore nosso acervo e compartilhe sua opinião!</p>
      )}
    </div>
  );
};

export default MyReviewsPage;