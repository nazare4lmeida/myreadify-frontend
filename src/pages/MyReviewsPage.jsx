// src/pages/MyReviewsPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./MyReviewsPage.css";
import mockLivros from "../data/mockData"; // Importe mockLivros para a lógica de mesclagem/fallback
import { getImageUrl } from '../utils/imageUtils'; // Importe a nova função utilitária

// REMOVER: A importação dinâmica de imagens do Vite não é mais necessária aqui
// const images = import.meta.glob("../assets/*.jpg", { eager: true });

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { signed } = useAuth();

  useEffect(() => {
    if (signed) {
      api
        .get("/reviews/my") // CORREÇÃO: endpoint correto conforme o backend
        .then((response) => {
          // A API agora deve retornar 'full_cover_url' no objeto 'book' aninhado.
          // Vamos enriquecer os dados para garantir que `cover_url` seja sempre a URL completa para exibição.
          const enrichedReviews = response.data.map((review) => {
            // Se o livro da review já vier da API com cover_url (que é full_cover_url), use-a.
            // Caso contrário, tente resolver via mockData ou placeholder.
            return {
              ...review,
              book: {
                ...review.book,
                // Use getImageUrl para garantir que a URL da capa é a correta para exibição
                cover_url: getImageUrl(review.book),
              },
            };
          });

          setReviews(enrichedReviews);
        })
        .catch((error) => {
          console.error("Falha ao buscar minhas avaliações:", error);
          // Em caso de erro na API, você pode decidir mostrar reviews mockadas ou vazias.
          // Por agora, mantemos vazio.
          setReviews([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [signed]);

  if (isLoading) {
    return (
      <div className="container">
        <p>Carregando suas avaliações...</p>
      </div>
    );
  }

  return (
    <div className="my-reviews-page">
      <h2>Minhas Avaliações</h2>
      {reviews.length > 0 ? (
        <div className="my-reviews-container">
          {reviews.map((review) => {
            const { book } = review;

            return (
              <div key={review.id} className="my-review-card">
                <Link to={`/livro/${book.slug}#review-${review.id}`}>
                  <img
                    src={book.cover_url} // A cover_url já estará resolvida por getImageUrl acima
                    alt={`Capa de ${book.title}`}
                    className="my-review-cover"
                  />
                </Link>
                <div className="my-review-details">
                  <Link to={`/livro/${book.slug}#review-${review.id}`}>
                    <h3>{book.title}</h3>
                  </Link>
                  <p className="my-review-rating">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </p>
                  <p className="my-review-content">"{review.content}"</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>
          Você ainda não fez nenhuma avaliação. Explore nosso acervo e
          compartilhe sua opinião!
        </p>
      )}
    </div>
  );
};

export default MyReviewsPage;
