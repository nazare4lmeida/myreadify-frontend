// src/pages/MyReviewsPage.jsx (VERSÃO FINAL COMPLETA E CORRIGIDA)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./MyReviewsPage.css";
// mockLivros não é mais estritamente necessário para resolver as URLs de capa
// porque o backend agora envia a URL completa ou o caminho que o frontend resolve dinamicamente.
// No entanto, pode ser útil para outras lógicas, se for o caso.
// import mockLivros from "../data/mockData"; 

// Importação dinâmica de imagens para o Vite.
// Isso é necessário para que o Vite processe corretamente as referências a imagens locais,
// caso alguma cover_url ainda venha como caminho relativo do mock.
const images = import.meta.glob('../assets/*.jpg', { eager: true });


const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { signed, user } = useAuth(); // Importar 'user' para verificar o ID do usuário

  // Função para resolver a URL da capa de forma inteligente (copiada de CategoriesPage/HomePage)
  const resolveCoverUrl = (coverPath) => {
    if (!coverPath) return 'https://via.placeholder.com/200x300.png?text=Sem+Capa';
    if (coverPath.startsWith('http')) { // Se já é uma URL completa (ex: de upload)
      return coverPath;
    }
    // Se for um caminho relativo (do mockData), tenta resolver com Vite
    const imageName = coverPath.split('/').pop();
    const viteImagePath = `../assets/${imageName}`;
    if (images[viteImagePath]) {
      return images[viteImagePath].default;
    } else {
      console.warn(`[MyReviewsPage] Imagem do mock não encontrada! Procurando por: "${viteImagePath}". Caminho original: "${coverPath}"`);
      return 'https://via.placeholder.com/200x300.png?text=Capa+N%C3%A3o+Encontrada';
    }
  };

  useEffect(() => {
    if (signed) {
      const fetchMyReviews = async () => {
        setIsLoading(true);
        try {
          // CORREÇÃO PRINCIPAL: Endpoint correto para buscar minhas avaliações
          const response = await api.get("/reviews/my"); 
          
          // Mapeia as reviews para garantir que a cover_url está resolvida
          const formattedReviews = response.data.map(review => ({
            ...review,
            book: {
              ...review.book,
              cover_url: resolveCoverUrl(review.book.cover_url) // Usa a função de resolução
            }
          }));

          setReviews(formattedReviews);
        } catch (error) {
          console.error("Falha ao buscar minhas avaliações:", error);
          // Opcional: mostrar uma mensagem de erro para o usuário
        } finally {
          setIsLoading(false);
        }
      };
      fetchMyReviews();
    } else {
      setIsLoading(false); // Se não estiver logado, para o carregamento
    }
  }, [signed]); // Dependência em 'signed' para rebuscar quando o status de login mudar

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
                {/* O slug do livro agora deve vir corretamente do backend */}
                <Link to={`/livro/${book.slug}#review-${review.id}`}>
                  <img
                    src={book.cover_url} // A cover_url já está resolvida pela função resolveCoverUrl
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
                  {/* Se você quiser adicionar botões de editar/deletar aqui, a lógica é similar a BookDetailPage */}
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
