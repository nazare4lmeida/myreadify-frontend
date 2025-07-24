import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { mockLivros } from "../data/mockData";
import BookCard from "../components/BookCard";
import { useAuth } from "../contexts/AuthContext";
import "./HomePage.css";

const HomePage = () => {
  const [latestBooks, setLatestBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const response = await api.get("/books?page=1&limit=6");

        if (response.data && Array.isArray(response.data.books)) {
          const apiBooks = response.data.books;

          const mockBooksMap = new Map(
            mockLivros.map((book) => [book.slug, book])
          );

          const finalBookList = apiBooks
            .map((apiBook) => {
              const mockVersion = mockBooksMap.get(apiBook.slug);

              if (mockVersion) {
                return {
                  ...mockVersion,
                  ...apiBook,
                  isPlaceholder: !apiBook.summary,
                };
              }
              // Se o livro da API foi criado do zero e não está no mock, retorna ele como está.
              return apiBook;
            })
            .filter((book) => book !== null);

          setLatestBooks(finalBookList.slice(0, 8));
        }
      } catch (error) {
        console.error("Erro ao buscar os destaques:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestBooks();
  }, []);

  const { signed } = useAuth();

  useEffect(() => {
    if (latestBooks.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % latestBooks.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [latestBooks]);

  const getSlideClass = (index) => {
    const total = latestBooks.length;
    if (index === currentSlide) return "active";
    if (index === (currentSlide - 1 + total) % total) return "prev";
    if (index === (currentSlide + 1) % total) return "next";
    return "";
  };

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Sua próxima grande leitura começa aqui.
            </h1>
            <p className="hero-subtitle">
              Descubra, compartilhe e apaixone-se por novas histórias em sua
              estante digital.
            </p>
            <Link to="/categorias" className="hero-cta-button">
              Explorar Resumos
            </Link>
          </div>
          <div className="hero-carousel-container">
            {loading ? (
              // Se estiver carregando, mostra o placeholder do carrossel principal
              <div className="hero-carousel-placeholder"></div>
            ) : (
              // Se já carregou, mostra o carrossel real, se houver livros
              latestBooks.length > 0 && (
                <div className="hero-carousel">
                  {latestBooks.map((book, index) => (
                    <img
                      key={book.slug}
                      src={book.coverUrl}
                      alt={`Capa do livro ${book.title}`}
                      className={getSlideClass(index)}
                      loading="lazy"
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {loading ? (
        <p style={{ textAlign: "center", padding: "2rem 0" }}>
          Carregando destaques...
        </p>
      ) : (
        latestBooks.length > 0 && (
          <section className="featured-section">
            <div className="featured-section-container">
              <h2>Adicionados Recentemente</h2>
              <div className="book-carousel">
                {loading
                  ? // Se estiver carregando, renderiza 8 "esqueletos" diretamente aqui
                    Array.from({ length: 8 }).map((_, index) => (
                      <div className="carousel-item" key={index}>
                        <div className="book-card-placeholder">
                          <div className="skeleton-cover"></div>
                          <div className="skeleton-info">
                            <div className="skeleton-line title"></div>
                            <div className="skeleton-line text"></div>
                          </div>
                          <div className="skeleton-button"></div>
                        </div>
                      </div>
                    ))
                  : // Se já carregou, renderiza os BookCards reais como antes
                    latestBooks.map((livro) => (
                      <div className="carousel-item" key={livro.slug}>
                        <BookCard livro={livro} />
                      </div>
                    ))}
              </div>
            </div>
          </section>
        )
      )}

      <section className="how-it-works-section">
        <h2>Uma comunidade de leitores</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Explore</h3>
            <p>
              Navegue por dezenas de resumos em diversas categorias e encontre
              seu próximo livro favorito.
            </p>
          </div>
          <div className="feature-card">
            <h3>Contribua</h3>
            <p>
              Enriqueça nossa biblioteca enviando seus próprios resumos de
              livros que você ama.
            </p>
          </div>
          <div className="feature-card">
            <h3>Avalie</h3>
            <p>
              Dê sua opinião, deixe comentários e ajude outros leitores a
              escolherem suas próximas jornadas.
            </p>
          </div>
        </div>
      </section>
      {signed ? (
        <section className="final-cta-section">
          <h2>Pronto para contribuir com a comunidade?</h2>
          <p>Envie seu primeiro resumo ou avalie um livro que você já leu!</p>

          <div className="contribution-actions">
            <Link to="/enviar-resumo" className="btn-action primary">
              Enviar Resumo
            </Link>
            <Link
              to="/categorias"
              className="btn-action secondary"
              onClick={() => window.scrollTo(0, 0)}
            >
              Deixar Avaliação
            </Link>
          </div>
        </section>
      ) : (
        <section className="final-cta-section">
          <h2>Pronto para começar sua jornada?</h2>
          <p>
            Crie sua conta e comece a construir sua estante digital hoje mesmo.
          </p>
          <Link to="/register" className="hero-cta-button secondary">
            Criar minha conta
          </Link>
        </section>
      )}
    </main>
  );
};

export default HomePage;
