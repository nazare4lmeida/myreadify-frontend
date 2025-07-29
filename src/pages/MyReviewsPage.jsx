// src/pages/MyReviewsPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./MyReviewsPage.css";
import mockLivros from "../data/mockData";

const images = import.meta.glob("../assets/*.jpg", { eager: true });

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
            const livroMock = mockLivros.find(
              (livro) =>
                livro.title.toLowerCase().trim() ===
                review.book.title.toLowerCase().trim()
            );

            let coverUrl = "";
            if (livroMock) {
              // se for livro mockado → usa imagem local
              const imageName = livroMock.cover_url.split("/").pop();
              const vitePath = `../assets/${imageName}`;
              coverUrl = images[vitePath]?.default || livroMock.cover_url;
            } else if (review.book.cover_url) {
              // se for livro enviado → usa direto a URL ou caminho salvo
              if (review.book.cover_url.startsWith("http")) {
                coverUrl = review.book.cover_url;
              } else {
                coverUrl = `http://localhost:3333/files/${review.book.cover_url}`;
              }
            }

            const bookData = {
              ...review.book,
              slug: livroMock ? livroMock.slug : review.book.slug || review.book.id,
              cover_url: coverUrl,
            };

            return { ...review, book: bookData };
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

            return (
              <div key={review.id} className="my-review-card">
                <Link to={`/livro/${book.slug}#review-${review.id}`}>
                  <img
                    src={book.cover_url}
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
