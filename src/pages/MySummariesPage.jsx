// src/pages/MySummariesPage.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./MySummariesPage.css";
import { getImageUrl } from '../utils/imageUtils'; // Importe a nova função utilitária

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
          // A cover_url já virá como full_cover_url do backend no objeto book aninhado
          // graças ao mapeamento no SummaryController.
          // No entanto, para garantir que o 'book' seja sempre um objeto válido
          // e tenha 'cover_url' processável por getImageUrl,
          // vamos mapear e aplicar getImageUrl aqui.
          const formattedSummaries = response.data.map(s => ({
            ...s,
            book: s.book ? { ...s.book, cover_url: getImageUrl(s.book) } : null,
          }));
          setSummaries(formattedSummaries);
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
          {summaries.map((summary) => (
            <li key={summary.id} className="summary-item">
              <Link
                to={summary.book?.slug ? `/livro/${summary.book.slug}` : '#'} // Use summary.book.slug
                className="summary-link-wrapper"
              >
                <img
                  src={summary.book?.cover_url} // A cover_url já estará resolvida por getImageUrl acima
                  alt={`Capa do livro ${summary.book?.title}`}
                  className="summary-cover-image"
                />
                <div className="summary-info">
                  <strong>{summary.book?.title}</strong>
                  <span>por {summary.book?.author}</span>
                </div>
                {typeof summary.status === "string" && (
                  <span className={`status status-${summary.status.toLowerCase()}`}>{summary.status === "PENDING" ? "PENDING" : summary.status}</span>
                )}
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
