// src/pages/MySummariesPage.jsx (VERSÃO FINAL COMPLETA E CORRIGIDA)

import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./MySummariesPage.css";

// Adicionar a importação dinâmica de imagens do Vite
const images = import.meta.glob('../assets/*.jpg', { eager: true });

const MySummariesPage = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { signed } = useAuth();

  useEffect(() => {
    if (signed) {
      const fetchMySummaries = async () => {
        try {
          const response = await api.get("/my-summaries");
          setSummaries(response.data);
        } catch (err) {
          setError(
            "Não foi possível carregar seus envios. Tente recarregar a página."
          );
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchMySummaries();
    } else {
      setLoading(false);
    }
  }, [signed]);

  // <<< CORREÇÃO PRINCIPAL: UMA FUNÇÃO MAIS ROBUSTA E COM DEPURADOR >>>
  const resolveCoverUrl = (coverPath) => {
    // 1. Se não houver caminho, retorna um placeholder.
    if (!coverPath) {
      return 'https://via.placeholder.com/150x220.png?text=Sem+Capa';
    }
    
    // 2. Se já for uma URL completa da API, retorna ela mesma.
    if (coverPath.startsWith('http')) {
      return coverPath;
    }

    // 3. Se for um caminho local do mockData, tenta resolver.
    const imageName = coverPath.split('/').pop(); // Pega o nome do arquivo, ex: "lordoftherings.jpg"
    const viteImagePath = `../assets/${imageName}`; // Monta a chave que o Vite espera: "../assets/lordoftherings.jpg"

    // 4. Verifica se a imagem foi encontrada pelo Vite.
    if (images[viteImagePath]) {
      // Se encontrou, retorna a URL processada pelo Vite.
      return images[viteImagePath].default;
    } else {
      // Se não encontrou, avisa no console qual chave estava procurando.
      // Isso nos ajuda a depurar se o caminho no mockData estiver diferente.
      console.error(`[MySummariesPage] Imagem do mock não encontrada! Procurando por: "${viteImagePath}"`);
      return 'https://via.placeholder.com/150x220.png?text=Capa+N%C3%A3o+Encontrada';
    }
  };

  // O resto do seu componente continua como estava...
  if (loading) {
    return (
      <div className="my-summaries-page container">
        <h2>Meus Resumos Enviados</h2>
        <p>Carregando seus envios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-summaries-page container">
        <h2>Meus Resumos Enviados</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="my-summaries-page container">
      <h2>Meus Resumos Enviados</h2>

      {summaries.length > 0 ? (
        <ul className="summaries-list">
          {summaries.map((summary) => (
            <li key={summary.id} className="summary-item">
              <Link
                to={summary.slug ? `/livro/${summary.slug}` : '#'}
                className="summary-link-wrapper"
              >
                <img
                  src={resolveCoverUrl(summary.cover_url)}
                  alt={`Capa do livro ${summary.title}`}
                  className="summary-cover-image"
                />
                <div className="summary-info">
                  <strong>{summary.title}</strong>
                  <span>por {summary.author}</span>
                </div>
                <span className={`status status-${summary.status.toLowerCase()}`}>
                  {summary.status === "PENDING" ? "Pendente" : summary.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Você ainda não enviou nenhum resumo.</p>
      )}
    </div>
  );
};

export default MySummariesPage;