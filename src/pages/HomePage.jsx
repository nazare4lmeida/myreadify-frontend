import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import mockLivros from '../data/mockData';
import BookCard from "../components/BookCard";
import { useAuth } from "../contexts/AuthContext";
import "./HomePage.css";

const images = import.meta.glob('../assets/*.jpg', { eager: true });

const HomePage = () => {
  const [latestBooks, setLatestBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { signed } = useAuth();

  const resolveCoverUrl = (coverPath) => {
    if (!coverPath) return '';
    // Se o coverPath já for uma URL processada do mock, use-a diretamente
    if (coverPath.includes('/assets/')) return coverPath;
    
    const imageName = coverPath.split('/').pop();
    const imagePath = `../assets/${imageName}`;
    return images[imagePath]?.default || '';
  };

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const response = await api.get("/books?page=1&limit=8");
        const apiBooks = Array.isArray(response.data) ? response.data : Array.isArray(response.data.books) ? response.data.books : [];
        const mockBooksMap = new Map(mockLivros.map((book) => [book.slug, book]));

        // CORREÇÃO NA LÓGICA DE MERGE:
        // Garante que usamos a base do mock (com slug e cover_url) e atualizamos com dados da API.
        const finalBookList = apiBooks
          .map((apiBook) => {
            const mockVersion = mockBooksMap.get(apiBook.slug);
            if (mockVersion) {
              // Mistura, priorizando o slug e a capa do mock, e o resto da API
              return { 
                ...apiBook, 
                ...mockVersion, 
                isPlaceholder: !apiBook.summary 
              };
            }
            // Se não encontrar no mock, mas a API tiver slug, ainda pode funcionar
            // Mas é mais seguro considerar apenas os livros que temos localmente
            return null;
          })
          .filter(Boolean); // Remove os nulos da lista

        // Se a lista da API for curta, podemos completá-la com mocks
        if (finalBookList.length < 8) {
            const existingSlugs = new Set(finalBookList.map(b => b.slug));
            const neededMocks = mockLivros.filter(b => !existingSlugs.has(b.slug)).slice(0, 8 - finalBookList.length);
            finalBookList.push(...neededMocks);
        }

        setLatestBooks(finalBookList.slice(0, 8));

      } catch (error) {
        console.error("Erro ao buscar os destaques, usando dados locais:", error);
        setLatestBooks(mockLivros.slice(0, 8)); // Fallback para mocks em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBooks();
  }, []);

  useEffect(() => {
    if (latestBooks.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % Math.min(latestBooks.length, 5));
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [latestBooks]);

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Sua próxima grande leitura começa aqui.</h1>
            <p className="hero-subtitle">Descubra, compartilhe e apaixone-se por novas histórias em sua estante digital.</p>
            <Link to="/categorias" className="hero-cta-button">Explorar Resumos</Link>
          </div>
          <div className="hero-carousel-container">
            {loading ? (
              <div className="hero-carousel-placeholder"></div>
            ) : (
              <div className="hero-carousel">
                {latestBooks.slice(0, 5).map((book, index) => (
                  <img
                    key={book.slug || book.id} // Usa ID como fallback para a key
                    src={resolveCoverUrl(book.cover_url)}
                    alt={`Capa do livro ${book.title}`}
                    className={`carousel-image ${index === currentSlide ? "active" : ""}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="featured-section-container">
          <h2 className="section-title">Adicionados Recentemente</h2>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <div className="book-carousel">
              {latestBooks.map((book) => (
                <div className="carousel-item" key={book.slug || book.id}>
                  <BookCard livro={{ ...book, cover_url: resolveCoverUrl(book.cover_url) }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* O resto do seu código continua aqui... */}
      <section className="how-it-works-section">
        <h2 className="section-title">Uma comunidade de leitores</h2>
        <div className="features-grid">
          <div className="feature-card"><h3>Explore</h3><p>Navegue por dezenas de resumos em diversas categorias e encontre seu próximo livro favorito.</p></div>
          <div className="feature-card"><h3>Contribua</h3><p>Enriqueça nossa biblioteca enviando seus próprios resumos de livros que você ama.</p></div>
          <div className="feature-card"><h3>Avalie</h3><p>Dê sua opinião, deixe comentários e ajude outros leitores a escolherem suas próximas jornadas.</p></div>
        </div>
      </section>

      {signed ? (
        <section className="final-cta-section">
          <h2>Pronto para contribuir com a comunidade?</h2>
          <p>Envie seu primeiro resumo ou avalie um livro que você já leu!</p>
          <div className="contribution-actions"><Link to="/enviar-resumo" className="btn-action primary">Enviar Resumo</Link><Link to="/categorias" className="btn-action secondary" onClick={() => window.scrollTo(0, 0)}>Deixar Avaliação</Link></div>
        </section>
      ) : (
        <section className="final-cta-section">
          <h2>Pronto para começar sua jornada?</h2>
          <p>Crie sua conta e comece a construir sua estante digital hoje mesmo.</p>
          <Link to="/register" className="hero-cta-button secondary">Criar minha conta</Link>
        </section>
      )}
    </main>
  );
};

export default HomePage;