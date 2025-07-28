// src/pages/BookDetailPage.jsx (VERSÃO FINAL COMPLETA E CORRIGIDA)

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api'; // Precisamos da API
import './BookDetailPage.css';
import { useAuth } from '../contexts/AuthContext';

// Componente placeholder para as estrelas de avaliação
const StarRatingForm = () => (
  <div className="star-rating"><div className="stars"><button>★</button><button>★</button><button>★</button><button>★</button><button>★</button></div></div>
);

const BookDetailPage = () => {
  const { slug } = useParams();
  const { signed } = useAuth();
  
  // Estados para guardar os dados do livro, loading e erro
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Função para buscar os detalhes do livro na API
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/books/${slug}`);
        setBook(response.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes do livro:", err);
        setError("Livro não encontrado ou indisponível.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [slug]); // Roda o efeito sempre que o slug na URL mudar

  // Renderiza mensagens de loading e erro
  if (loading) {
    return <div className="centered-message">Carregando detalhes do livro...</div>;
  }

  if (error || !book) {
    return <div className="centered-message">{error || "Livro não encontrado."}</div>;
  }

  // A partir daqui, o componente usa o estado 'book' que veio da API
  return (
    <div className="book-detail-page container">
      <div className="book-detail-content">
        <img src={book.cover_url} alt={`Capa do livro ${book.title}`} className="book-detail-cover" />
        <div className="book-detail-info">
          <h1>{book.title}</h1>
          <h2>por {book.author}</h2>
          <p className="category-tag">{book.category}</p>
          
          {/* Verifica se existe um resumo vindo da API */}
          {book.summary ? (
            <>
              <h3>Resumo</h3>
              <p className="book-summary-text">{book.summary}</p>
              
              {/* <<< CORREÇÃO PRINCIPAL: Exibe o nome do usuário >>> */}
              {/* Se o campo 'submitted_by' existir, exibimos a linha de crédito. */}
              {book.submitted_by && (
                <p className="submitted-by-text">
                  Enviado por: <strong>{book.submitted_by}</strong>
                </p>
              )}
            </>
          ) : (
            // Se não houver resumo, mostra o prompt para enviar um
            <div className="summary-prompt">
              <p>Este livro ainda não tem um resumo aprovado.</p>
              {signed ? (
                <div className="summary-actions" style={{ justifyContent: 'center' }}>
                  <Link 
                    to="/enviar-resumo" 
                    state={{ book: book }} // Envia os dados do livro para a página de envio
                    className="btn btn-primary"
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

      {/* Seção de Avaliações (continua como estava) */}
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