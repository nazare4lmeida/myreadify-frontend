import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import mockLivros from '../data/mockData';
import BookCard from "../components/BookCard";
import { useAuth } from "../contexts/AuthContext";
import "./HomePage.css";

// Importação dinâmica de imagens para o Vite.
// Isso é necessário para que o Vite processe corretamente as referências a imagens locais.
const images = import.meta.glob('../assets/*.jpg', { eager: true });

const HomePage = () => {
  const [latestBooks, setLatestBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { signed } = useAuth();

  // Função para resolver a URL da capa de forma inteligente.
  // Ela lida tanto com caminhos locais (mockdata) quanto com URLs completas (uploads da API).
  const resolveCoverUrl = (coverPath) => {
    // Se não houver caminho, retorna uma string vazia (ou um placeholder se preferir).
    if (!coverPath) return '';
    
    // Se o caminho já for uma URL completa (ex: de um upload no Render/Supabase Storage),
    // retorna-a diretamente. O backend agora garante que 'cover_url' é a URL completa ou o caminho relativo do mock.
    if (coverPath.startsWith('http')) {
      return coverPath;
    }
    
    // Se for um caminho relativo (como os do mockData, ex: 'lordoftherings.jpg' ou '/src/assets/1984.jpg'),
    // tenta resolver usando as imagens importadas pelo Vite.
    // Extrai apenas o nome do arquivo para formar a chave de importação.
    const imageName = coverPath.split('/').pop();
    const viteImagePath = `../assets/${imageName}`;
    
    // Verifica se a imagem foi encontrada no objeto de importação do Vite.
    if (images[viteImagePath]) {
      return images[viteImagePath].default; // Retorna a URL final da imagem local processada pelo Vite.
    } else {
      console.warn(`[HomePage] Imagem do mock não encontrada! Procurando por: "${viteImagePath}". Caminho original: "${coverPath}"`);
      return 'https://via.placeholder.com/200x300.png?text=Capa+N%C3%A3o+Encontrada'; // Fallback se não encontrar.
    }
  };

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const response = await api.get("/books?page=1&limit=8");
        // Garante que response.data é um array, mesmo que a API retorne um objeto com 'books'.
        const apiBooks = Array.isArray(response.data) ? response.data : Array.isArray(response.data.books) ? response.data.books : [];
        const mockBooksMap = new Map(mockLivros.map((book) => [book.slug, book]));

        // Constrói a lista final de livros, mesclando dados da API com os do mock.
        // Isso garante que temos os slugs e covers corretos para os livros mockados,
        // mas com a informação de resumo e status da API.
        const mergedBooks = apiBooks
          .map((apiBook) => {
            const mockVersion = mockBooksMap.get(apiBook.slug);
            if (mockVersion) {
              // Se o livro existe no mock e na API, mescla, priorizando cover_url do mock
              // para garantir que a imagem local seja usada se o mock tiver uma.
              return { 
                ...mockVersion, // Pega o ID, cover_url e slug do mock
                ...apiBook,     // Sobrescreve com os dados da API (título, autor, categoria, resumo, status)
                isPlaceholder: !apiBook.summary // Indica se tem resumo da API
              };
            }
            // Se o livro veio da API e não está no mock, usa a versão da API diretamente.
            // A cover_url já virá resolvida pelo getter do backend.
            return { ...apiBook, isPlaceholder: !apiBook.summary };
          });

        // Coleta todos os slugs já presentes na lista mesclada para evitar duplicatas.
        const existingSlugs = new Set(mergedBooks.map(b => b.slug));
        // Adiciona livros do mock que não foram sobrepostos pela API (ex: livros que ainda não tiveram resumo enviado).
        const uniqueMockBooks = mockLivros.filter(b => !existingSlugs.has(b.slug));

        // Combina os livros mesclados com os mockbooks únicos e limita a 8.
        const finalBookList = [...mergedBooks, ...uniqueMockBooks]
          .map(book => ({ ...book, cover_url: resolveCoverUrl(book.cover_url) })) // Garante que todas as URLs de capa estão resolvidas.
          .slice(0, 8); // Pega apenas os 8 primeiros para a seção de "Adicionados Recentemente".

        setLatestBooks(finalBookList);

      } catch (error) {
        console.error("Erro ao buscar os destaques, usando dados locais:", error);
        // Fallback para usar apenas os livros mockados em caso de erro na API.
        setLatestBooks(mockLivros.slice(0, 8).map(book => ({ ...book, cover_url: resolveCoverUrl(book.cover_url) })));
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBooks();
  }, []); // Array de dependências vazio para rodar uma vez na montagem.

  useEffect(() => {
    if (latestBooks.length > 0) {
      const timer = setInterval(() => {
        // O carrossel exibe no máximo 5 imagens, então o cálculo do slide deve ser baseado nisso.
        setCurrentSlide((prevSlide) => (prevSlide + 1) % Math.min(latestBooks.length, 5));
      }, 3000); // Muda de slide a cada 3 segundos.
      return () => clearInterval(timer); // Limpa o timer ao desmontar o componente.
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
              <div className="hero-carousel-placeholder"></div> // Placeholder enquanto carrega.
            ) : (
              <div className="hero-carousel">
                {/* Exibe os primeiros 5 livros no carrossel do herói. */}
                {latestBooks.slice(0, 5).map((book, index) => (
                  <img
                    key={book.slug || book.id} // Usa slug ou ID como fallback para a key.
                    src={book.cover_url} // A URL da capa já está resolvida pelo useEffect.
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
            <p>Carregando...</p> // Mensagem de carregamento.
          ) : (
            <div className="book-carousel">
              {/* Exibe todos os 8 livros (ou menos, se não houver tantos). */}
              {latestBooks.map((book) => (
                <div className="carousel-item" key={book.slug || book.id}>
                  {/* Passa o objeto book completo, com a cover_url já resolvida. */}
                  <BookCard livro={book} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Seções "Como Funciona" e CTA final */}
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
