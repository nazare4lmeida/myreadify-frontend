// src/pages/BookDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import "./BookDetailPage.css";
import mockLivros from "../data/mockData";
import { useAuth } from "../contexts/AuthContext";
import { getImageUrl } from '../utils/imageUtils'; // Importe a nova função utilitária

// REMOVER: A importação de imagens não é mais necessária aqui, pois 'getImageUrl' a lida.
// const images = import.meta.glob("../assets/*.jpg", { eager: true });

const StarRatingForm = ({ onChange, initialValue = 0 }) => {
  const [rating, setRating] = useState(initialValue);

  const handleClick = (value) => {
    setRating(value);
    onChange(value);
  };

  return (
    <div className="star-rating">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            type="button"
            key={value}
            className={value <= rating ? "active" : ""}
            onClick={() => handleClick(value)}
          >
            ★
          </button>
        ))}
      </div>
      {/* The rest of your StarRatingForm component continues here... */}
    </div>
  );
};

const BookDetailPage = () => {
  const { slug } = useParams();
  const { signed, user } = useAuth();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // REMOVER: 'imageUrl' e 'resolvedImageUrl' não são mais necessários como estados separados
  // const [imageUrl, setImageUrl] = useState(""); 
  // const [resolvedImageUrl, setResolvedImageUrl] = useState(''); 
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(0);

  useEffect(() => {
    const fetchBookData = async () => {
      setLoading(true);
      setError("");
      setBookData(null);
      try {
        const response = await api.get(`/books/${slug}`);
        setBookData(response.data);

        try {
          const reviewsResponse = await api.get(`/books/${slug}/reviews`);
          setReviews(reviewsResponse.data);
        } catch (err) {
          console.error("Erro ao carregar avaliações:", err.response || err);
          setReviews([]);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // Tenta encontrar no mockData se não for encontrado na API
          const mockBook = mockLivros.find((book) => book.slug === slug);
          if (mockBook) {
            // Simula a estrutura que viria da API, incluindo o campo de cover_url do mock
            setBookData({ ...mockBook, summary: null, submitted_by: null }); 
          } else {
            setError("Livro não encontrado.");
          }
        } else {
          setError("Não foi possível carregar o livro.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [slug]);

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta avaliação?")) return;
    try {
      await api.delete(`/reviews/${id}`); 
      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (err) {
      console.error("Erro ao excluir avaliação:", err.response || err);
      alert("Erro ao excluir avaliação.");
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review.id);
    setEditContent(review.content);
    setEditRating(review.rating);
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        `/reviews/${editingReviewId}`,
        { content: editContent, rating: editRating }
      );
      setReviews((prev) =>
        prev.map((rev) =>
          rev.id === editingReviewId ? response.data : rev
        )
      );
      setEditingReviewId(null);
      setEditContent("");
      setEditRating(0);
    } catch (err) {
      console.error("Erro ao atualizar avaliação:", err.response || err);
      alert("Erro ao atualizar avaliação.");
    }
  };

  // NOTE: Com as correções no backend, 'userId' deve vir corretamente.
  const hasReviewed = signed && reviews.some(r => r.userId === user?.id);

  if (loading) {
    return <div className="centered-message">Carregando livro...</div>;
  }

  if (error || !bookData) {
    return (
      <div className="centered-message">{error || "Livro não encontrado."}</div>
    );
  }

  return (
    <div className="book-detail-page container">
      <div className="book-detail-content">
        {/* Usa getImageUrl diretamente com bookData */}
        {bookData && (
          <img
            src={getImageUrl(bookData)} 
            alt={`Capa do livro ${bookData.title}`}
            className="book-detail-cover"
          />
        )}
        <div className="book-detail-info">
          <h1>{bookData.title}</h1>
          <h2>por {bookData.author}</h2>
          <p className="category-tag">{bookData.category}</p>

          {bookData.summary ? (
            <>
              <h3>Resumo</h3>
              <p className="book-summary-text">{bookData.summary}</p>
              {bookData.submitted_by && (
                <p className="submitted-by-text">
                  Enviado por: <strong>{bookData.submitted_by}</strong>
                </p>
              )}
            </>
          ) : (
            <div className="summary-prompt">
              <p>Este livro ainda não tem um resumo.</p>
              {signed ? (
                <div className="summary-actions" style={{ justifyContent: "center" }}>
                  <Link
                    to="/enviar-resumo"
                    state={{ book: bookData }} // Passa o objeto bookData completo
                    className="btn btn-primary"
                  >
                    Seja o primeiro a enviar!
                  </Link>
                </div>
              ) : (
                <div className="summary-actions" style={{ justifyContent: "center" }}>
                  <Link to="/login" className="btn btn-primary">
                    Entrar
                  </Link>
                  <Link to="/register" className="btn btn-outline">
                    Criar Conta
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="book-detail-reviews-wrapper">
        <div className="reviews-section">
          <h3>Avaliações</h3>
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="review-item">
                  {editingReviewId === review.id ? (
                    <form onSubmit={handleUpdateReview} className="review-form">
                      <h4>Editar Avaliação</h4>
                      <StarRatingForm
                        onChange={(value) => setEditRating(value)}
                        initialValue={editRating}
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows="4"
                      />
                      <div className="user-review-actions">
                        <button type="submit" className="btn-user-action btn-edit">
                          Salvar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingReviewId(null)}
                          className="btn-user-action btn-cancel"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <p>
                        <strong>{review.user?.name || "Anônimo"}</strong> —{" "}
                        {"★".repeat(review.rating)}
                      </p>
                      <p>{review.content}</p>
                      {signed && user?.id === review.userId && (
                        <div className="user-review-actions">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="btn-user-action btn-edit"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="btn-user-action btn-delete"
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>Ainda não há avaliações para este livro.</p>
            )}
          </div>

          <div className="add-review-section">
            {signed && !editingReviewId ? (
              hasReviewed ? (
                <div className="already-reviewed">
                  <p>✅ Você já avaliou este livro.</p>
                </div>
              ) : (
                <form
                  className="review-form"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const content = e.target.content.value;
                    const rating = selectedRating;

                    if (!rating || !content) {
                      alert("Preencha a nota e o comentário.");
                      return;
                    }

                    try {
                      const response = await api.post(
                        `/books/${slug}/reviews`,
                        { rating, content }
                      );

                      setReviews((prev) => [response.data, ...prev]);
                      e.target.reset();
                      setSelectedRating(0);
                    } catch (err) {
                      console.error("Erro ao enviar avaliação:", err.response || err);
                      alert(
                        err.response?.data?.error ||
                          "Não foi possível enviar sua avaliação."
                      );
                    }
                  }}
                >
                  <h4>Deixe sua avaliação</h4>
                  <div className="form-group">
                    <label>Nota</label>
                    <StarRatingForm
                      onChange={(value) => setSelectedRating(value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="content">Comentário</label>
                    <textarea id="content" name="content" rows="4"></textarea>
                  </div>
                  <button type="submit">Enviar Avaliação</button>
                </form>
              )
            ) : !signed && (
              <div className="login-prompt">
                <h4>Deixe sua avaliação</h4>
                <p>Você precisa estar logado para avaliar este livro.</p>
                <div className="auth-links">
                  <Link to="/login" className="btn-login">
                    Entrar
                  </Link>
                  <Link to="/register" className="btn-register">
                    Criar Conta
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
