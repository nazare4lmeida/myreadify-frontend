// src/pages/MyReviewsPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './MyReviewsPage.css';

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { signed } = useAuth();

  useEffect(() => {
    if (signed) {
      api.get('/reviews/my-reviews')
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
  }, [signed]);

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
              {/* Link atualizado para usar review.book.slug */}
              <Link to={`/livro/${review.book.slug}#review-${review.id}`}>
                <img
                  src={review.book.full_cover_url} // Assumindo que a API retorna a URL completa
                  alt={`Capa de ${review.book.title}`}
                  className="my-review-cover"
                />
              </Link>
              <div className="my-review-details">
                {/* Link atualizado para usar review.book.slug */}
                <Link to={`/livro/${review.book.slug}#review-${review.id}`}>
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