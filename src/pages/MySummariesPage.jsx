// src/pages/MySummariesPage.jsx (Versão Final e Simplificada)

import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./MySummariesPage.css";
// O mockData não é mais necessário aqui para a lógica da imagem
// import mockLivros from "../data/mockData";

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
          // Vamos dar um console.log para ter 100% de certeza do que chegou
          console.log("Dados recebidos da API:", response.data); 
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

  // A lógica de loading e error continua a mesma...
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
          {/* O map agora ficou muito mais simples */}
          {summaries.map((summary) => (
            <li key={summary.id} className="summary-item">
              <Link
                // Usamos o slug diretamente do objeto summary
                to={summary.slug ? `/livro/${summary.slug}` : '#'}
                className="summary-link-wrapper"
              >
                <img
                  // Usamos a cover_url diretamente do objeto summary
                  // O backend já nos dá a URL completa e pronta!
                  src={summary.cover_url} 
                  alt={`Capa do livro ${summary.title}`}
                  className="summary-cover-image"
                />

                <div className="summary-info">
                  {/* O título e autor também vêm direto de summary */}
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