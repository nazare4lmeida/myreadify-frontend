import React from 'react';
import { useParams, Link } from 'react-router-dom';
import './BookDetailPage.css';
import mockLivros from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

// Componente placeholder
const StarRatingForm = () => (
  <div className="star-rating"><div className="stars"><button>★</button><button>★</button><button>★</button><button>★</button><button>★</button></div></div>
);

const BookDetailPage = () => {
  const { slug } = useParams();
  const { signed } = useAuth();
  const bookData = mockLivros.find(book => book.slug === slug);

  if (!bookData) {
    return <div className="centered-message">Livro não encontrado.</div>;
  }

  const imageUrl = bookData.cover_url;

  return (
    <div className="book-detail-page container">
      <div className="book-detail-content">
        <img src={imageUrl} alt={`Capa do livro ${bookData.title}`} className="book-detail-cover" />
        <div className="book-detail-info">
          <h1>{bookData.title}</h1>
          <h2>por {bookData.author}</h2>
          <p className="category-tag">{bookData.category}</p>
          
          {bookData.summary && !bookData.isPlaceholder ? (
            <>
              <h3>Resumo</h3>
              <p className="book-summary-text">{bookData.summary}</p>
            </>
          ) : (
            <div className="summary-prompt">
              <p>Este livro ainda não tem um resumo.</p>
              {signed ? (
                // >>> A CORREÇÃO ESTÁ AQUI <<<
                // Usamos a mesma estrutura dos botões de login/registro para reutilizar o estilo.
                <div className="summary-actions" style={{ justifyContent: 'center' }}>
                  <Link 
                    to="/enviar-resumo" 
                    state={{ book: bookData }} 
                    className="btn btn-primary" // Classe correta para o botão marrom
                  >
                    Seja o primeiro a enviar!
                  </Link>
                </div>
              ) : (
                <div className="summary-actions" style={{ justifyContent: 'center' }}>
                  <Link to="/login" className="btn btn-primary">Entrar</Link>
                  <Link to="/register" className="btn btn-outline">Criar Conta</Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Seção de Avaliações */}
      <div className="book-detail-reviews-wrapper">
        <div className="reviews-section">
          <h3>Avaliações</h3>
          <div className="reviews-list">
            <p>Ainda não há avaliações para este livro.</p>
          </div>
          <div className="add-review-section">
            {signed ? (
              <form className="review-form">
                <h4>Deixe sua avaliação</h4>
                <div className="form-group"><label>Nota</label><StarRatingForm /></div>
                <div className="form-group"><label htmlFor="comment">Comentário</label><textarea id="comment" name="comment" rows="4"></textarea></div>
                <button type="submit">Enviar Avaliação</button>
              </form>
            ) : (
              <div className="login-prompt">
                <h4>Deixe sua avaliação</h4>
                <p>Você precisa estar logado para avaliar este livro.</p>
                <div className="auth-links"><Link to="/login" className="btn-login">Entrar</Link><Link to="/register" className="btn-register">Criar Conta</Link></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;