// src/pages/BookDetailPage.jsx (VERSÃO FINAL COMPLETA E CORRIGIDA)

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
  const [error, setError] = useState('');
  
  // <<< CORREÇÃO 1: Um estado separado para a URL final da imagem >>>
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchBookData = async () => {
      setLoading(true);
      setError('');
      setBookData(null);
      setImageUrl('');

      try {
        const response = await api.get(`/books/${slug}`);
        setBookData(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          const mockBook = mockLivros.find(book => book.slug === slug);
          if (mockBook) {
            setBookData(mockBook);
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

  // <<< CORREÇÃO 2: Um segundo useEffect para resolver a imagem DEPOIS que os dados do livro forem carregados >>>
  useEffect(() => {
    if (bookData?.cover_url) {
      const path = bookData.cover_url;

      if (path.startsWith('http')) {
        setImageUrl(path); // URL da API, usa direto
      } else {
        // Caminho do mock, resolvemos com o Vite
        const imageName = path.split('/').pop();
        const viteImagePath = `../assets/${imageName}`;
        const resolvedPath = images[viteImagePath]?.default;
        
        if (resolvedPath) {
          setImageUrl(resolvedPath);
        } else {
          setImageUrl('https://via.placeholder.com/200x300.png?text=Capa+Inv%C3%A1lida');
        }
      }
    }
  }, [bookData]); // Roda sempre que o bookData mudar

  if (loading) {
    return <div className="centered-message">Carregando livro...</div>;
  }
  
  if (error || !bookData) {
    return <div className="centered-message">{error || "Livro não encontrado."}</div>;
  }

  return (
    <div className="book-detail-page container">
      <div className="book-detail-content">
        {/* <<< CORREÇÃO 3: Usar o estado 'imageUrl' que foi resolvido pelo useEffect >>> */}
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