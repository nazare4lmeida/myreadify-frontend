import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./MyReviewsPage.css";
import { mockLivros } from "../data/mockData";

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { signed } = useAuth();

  useEffect(() => {
    if (signed) {
      api
        .get("/reviews/my-reviews")
        .then((response) => {
          const enrichedReviews = response.data.map((review) => {
            // CORREÇÃO APLICADA AQUI:
            // Normaliza os títulos para minúsculas e remove espaços extras antes de comparar.
            // Isso garante que a busca funcione de forma consistente.
            const livroMock = mockLivros.find(
              (livro) =>
                livro.title.toLowerCase().trim() ===
                review.book.title.toLowerCase().trim()
            );

            // Combina os dados, garantindo que 'slug' e 'coverUrl' venham do mock
            const bookData = {
              ...review.book,
              slug: livroMock ? livroMock.slug : undefined,
              coverUrl: livroMock
                ? livroMock.coverUrl
                : review.book.full_cover_url,
            };

            return {
              ...review,
              book: bookData,
            };
          });

          setReviews(enrichedReviews);
        })
        .catch((error) => {
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
            const coverImage = book.coverUrl;

            return (
              <div key={review.id} className="my-review-card">
                {/* O link agora funcionará pois 'book.slug' terá o valor correto */}
                <Link to={`/livro/${book.slug}#review-${review.id}`}>
                  <img
                    src={coverImage}
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
                  <p className="my-review-comment">"{review.comment}"</p>
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