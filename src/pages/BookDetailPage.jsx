// src/pages/BookDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import './BookDetailPage.css';

const BookDetailPage = () => {
  const { slug } = useParams();
  const location = useLocation();

  const [bookData, setBookData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Estados para o formulário de CRIAÇÃO de avaliação
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Estados para o modo de EDIÇÃO de avaliação
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const bookRes = await api.get(`/books/${slug}`);
        const fetchedBook = bookRes.data;
        setBookData(fetchedBook);

        const [reviewsRes, authRes] = await Promise.all([
          api.get(`/books/${fetchedBook.id}/reviews`),
          api.get('/check-auth').catch(() => ({ data: { loggedIn: false } })),
        ]);
        
        setReviews(reviewsRes.data);
        if (authRes.data.loggedIn) {
          setCurrentUser(authRes.data.user);
        }
      } catch (err) {
        setError('Livro não encontrado ou não disponível.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    if (!isLoading && location.hash) {
      const elementId = location.hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlighted');
        setTimeout(() => {
          element.classList.remove('highlighted');
        }, 2500);
      }
    }
  }, [isLoading, location.hash]);

  const userReview = currentUser ? reviews.find(r => r.user.id === currentUser.id) : null;

  const handleCreateReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await api.post(`/books/${bookData.id}/reviews`, { rating: newRating, comment: newComment });
      setReviews([response.data, ...reviews]);
      setNewComment('');
      setNewRating(5);
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'Ocorreu um erro ao enviar sua avaliação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Tem certeza que deseja deletar sua avaliação?')) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        setReviews(reviews.filter(r => r.id !== reviewId));
      } catch (err) {
        alert('Falha ao deletar a avaliação.');
      }
    }
  };

  const handleStartEdit = (review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await api.put(`/reviews/${editingReviewId}`, { rating: editRating, comment: editComment });
      setReviews(reviews.map(r => (r.id === editingReviewId ? response.data : r)));
      setEditingReviewId(null);
    } catch (err) {
      alert('Falha ao atualizar a avaliação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="container"><p>Carregando...</p></div>;
  if (error) return <div className="container"><p>{error} <Link to="/categorias">Voltar</Link></p></div>;
  if (!bookData) return null;

  return (
    <div className="book-detail-page">
      <div className="book-detail-content">
        <img
          src={bookData.full_cover_url || 'https://via.placeholder.com/300x450.png?text=Sem+Capa'}
          alt={`Capa de ${bookData.title}`}
          className="book-detail-cover"
        />
        <div className="book-detail-info">
          <h1>{bookData.title}</h1>
          <p className="book-summary-text">{bookData.summary}</p>
          {bookData.submitter && (
            <p className="summary-submitter" style={{ marginTop: '1.5rem', fontStyle: 'italic', color: '#555' }}>
              Resumo enviado por: <strong>{bookData.submitter.name}</strong>
            </p>
          )}
        </div>
      </div>

      {/* --- SEÇÃO DE AVALIAÇÕES RESTAURADA --- */}
      <div className="reviews-section">
        <h3>Avaliações dos Leitores</h3>
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} id={`review-${review.id}`} className="review-wrapper">
                {editingReviewId === review.id ? (
                  <form onSubmit={handleUpdateReview} className="review-card review-form">
                    <h4>Editando sua avaliação</h4>
                    <div className="form-group star-rating">
                      <label>Nota:</label>
                      <div className="stars">
                        {[1, 2, 3, 4, 5].map(star => <button type="button" key={star} className={star <= editRating ? 'active' : ''} onClick={() => setEditRating(star)}>★</button>)}
                      </div>
                    </div>
                    <div className="form-group">
                      <textarea value={editComment} onChange={e => setEditComment(e.target.value)} required />
                    </div>
                    <div className="user-review-actions">
                      <button type="submit" className="btn-user-action btn-edit" disabled={isSubmitting}>{isSubmitting ? 'Salvando...' : 'Salvar'}</button>
                      <button type="button" className="btn-user-action btn-cancel" onClick={handleCancelEdit}>Cancelar</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="review-card">
                      <div className="review-header">
                        <span className="review-author">{review.user.name} {review.user.role === 'ADMIN' && '(Admin)'}</span>
                        <span className="review-rating">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                    {currentUser?.id === review.user.id && (
                      <div className="user-review-actions">
                        <button onClick={() => handleStartEdit(review)} className="btn-user-action btn-edit">Editar</button>
                        <button onClick={() => handleDeleteReview(review.id)} className="btn-user-action btn-delete">Deletar</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>Este livro ainda não tem avaliações. Seja o primeiro a comentar!</p>
        )}
      </div>

      {/* --- SEÇÃO DE ADICIONAR AVALIAÇÃO RESTAURADA --- */}
      <div className="add-review-section">
        {!currentUser && (
          <div className="login-prompt">
            <h4>Deixe sua avaliação</h4>
            <p>Para avaliar este livro, você precisa estar conectado.</p>
            <div className="auth-links">
              <Link to="/login" className="btn-login">Fazer Login</Link>
              <Link to="/register" className="btn-register">Cadastrar-se</Link>
            </div>
          </div>
        )}
        {currentUser && userReview && !editingReviewId && (
          <div className="login-prompt">
            <h4>Você já avaliou este livro.</h4>
          </div>
        )}
        {currentUser && !userReview && (
          <form onSubmit={handleCreateReview} className="review-form">
            <h4>Deixe sua avaliação</h4>
            <div className="form-group star-rating">
              <label>Nota:</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map(star => <button type="button" key={star} className={star <= newRating ? 'active' : ''} onClick={() => setNewRating(star)}>★</button>)}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="comment">Comentário:</label>
              <textarea id="comment" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="O que você achou do livro?" required />
            </div>
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}</button>
            {submitError && <p className="feedback-message error">{submitError}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default BookDetailPage;