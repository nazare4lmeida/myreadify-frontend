import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './BookDetailPage.css';
import mockLivros from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const images = import.meta.glob('../assets/*.jpg', { eager: true });

const StarRatingForm = () => (
  <div className="star-rating"><div className="stars"><button>★</button><button>★</button><button>★</button><button>★</button><button>★</button></div></div>
);

const BookDetailPage = () => {
  const { slug } = useParams();
  const { signed } = useAuth();
  
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Primeiro, sempre procuramos no mock para ter os dados base.
    const initialBook = mockLivros.find(book => book.slug === slug);
    
    // Tentamos buscar na API para obter os dados mais recentes (como o resumo).
    api.get(`/books/${slug}`)
      .then(response => {
        // SUCESSO: O livro existe na API (já foi enviado e aprovado).
        // Usamos os dados da API, mas GARANTIMOS que a imagem do mock seja usada se o livro for do mock.
        const apiBook = response.data;
        const finalBookData = initialBook 
          ? { ...initialBook, ...apiBook, cover_url: initialBook.cover_url } 
          : apiBook;
        setBookData(finalBookData);
      })
      .catch(err => {
        // FALHA: A API deu erro (provavelmente 404). Isso significa que o livro SÓ existe no mock.
        if (initialBook) {
          // Nesse caso, usamos apenas os dados do mock.
          setBookData(initialBook);
        } else {
          // Não está na API nem no mock.
          setBookData(null); 
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  // A função para resolver a imagem está correta
  const resolveCoverUrl = (coverPath) => {
    if (!coverPath) return 'https://via.placeholder.com/200x300.png?text=Sem+Capa';
    if (coverPath.startsWith('http')) return coverPath; // Para livros 100% da API
    const imageName = coverPath.split('/').pop();
    const viteImagePath = `../assets/${imageName}`;
    return images[viteImagePath]?.default || 'https://via.placeholder.com/200x300.png?text=Capa+Inv%C3%A1lida';
  };
  
  if (loading) {
    return <div className="centered-message">Carregando livro...</div>;
  }
  
  if (!bookData) {
    return <div className="centered-message">Livro não encontrado.</div>;
  }

  const imageUrl = resolveCoverUrl(bookData.cover_url);

  return (
    <div className="book-detail-page container">
      <div className="book-detail-content">
        <img src={imageUrl} alt={`Capa do livro ${bookData.title}`} className="book-detail-cover" />
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
                <div className="summary-actions" style={{ justifyContent: 'center' }}>
                  <Link to="/enviar-resumo" state={{ book: bookData }} className="btn btn-primary">
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
      <div className="book-detail-reviews-wrapper">
        <div className="reviews-section">
          <h3>Avaliações</h3>
          <div className="reviews-list"><p>Ainda não há avaliações para este livro.</p></div>
          <div className="add-review-section">
            {signed ? (
              <form className="review-form">
                <h4>Deixe sua avaliação</h4>
                <div className="form-group"><label>Nota</label><StarRatingForm /></div>
                <div className="form-group"><label htmlFor="content">Comentário</label><textarea id="content" name="content" rows="4"></textarea></div>
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