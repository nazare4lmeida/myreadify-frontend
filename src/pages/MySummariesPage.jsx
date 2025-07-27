// src/pages/MySummariesPage.jsx (Versão Final e Corrigida)

import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./MySummariesPage.css";
import mockLivros from "../data/mockData";

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
          {summaries.map((summary) => {
            // >>> INÍCIO DA LÓGICA FINAL <<<
            
            // 1. Pegamos o slug que agora vem da API.
            const apiSlug = summary.books?.slug;

            // 2. Usamos o slug para encontrar o livro correspondente no nosso mockData local.
            const localBook = mockLivros.find(book => book.slug === apiSlug);

            // 3. A imagem será a do mock local se o livro for encontrado, senão, será a da API.
            const imageUrl = localBook ? localBook.cover_url : summary.books?.cover_url;

            // >>> FIM DA LÓGICA FINAL <<<

            return (
              <li key={summary.id} className="summary-item">
                <Link
                  // O link agora usa o slug da API, resolvendo o erro 'undefined'.
                  to={apiSlug ? `/livro/${apiSlug}` : '#'}
                  className="summary-link-wrapper"
                >
                  <img
                    // A imagem agora é a correta (local ou da API).
                    src={imageUrl}
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
            );
          })}
        </ul>
      ) : (
        <p>Você ainda não enviou nenhum resumo.</p>
      )}
    </div>
  );
};

export default MySummariesPage;