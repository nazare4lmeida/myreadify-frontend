// src/pages/MySummariesPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Seu serviço de API
import { useAuth } from '../contexts/AuthContext'; // Seu contexto de autenticação
import './MySummariesPage.css'; // O arquivo CSS que vamos criar a seguir

const MySummariesPage = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { signed } = useAuth();

  useEffect(() => {
    // A função só executa se o usuário estiver logado
    if (signed) {
      const fetchMySummaries = async () => {
        try {
          // Usamos o endpoint que já existe no seu BookController para buscar os livros do usuário
          const response = await api.get('/my-books');
          setSummaries(response.data);
        } catch (err) {
          setError('Não foi possível carregar seus envios. Tente recarregar a página.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchMySummaries();
    } else {
      // Se não estiver logado, não precisa carregar
      setLoading(false);
    }
  }, [signed]); // O efeito depende do status de login do usuário

  // Renderização enquanto os dados estão sendo buscados
  if (loading) {
    return (
      <div className="my-summaries-page container">
        <h2>Meus Resumos Enviados</h2>
        <p>Carregando seus envios...</p>
      </div>
    );
  }
  
  // Renderização caso ocorra um erro na busca
  if (error) {
    return (
      <div className="my-summaries-page container">
        <h2>Meus Resumos Enviados</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  // Renderização principal
  return (
    <div className="my-summaries-page container">
      <h2>Meus Resumos Enviados</h2>
      
      {summaries.length > 0 ? (
        <ul className="summaries-list">
          {summaries.map(summary => (
            <li key={summary.id} className="summary-item">
              <div className="summary-info">
                <strong>{summary.title}</strong>
                <span>por {summary.author}</span>
              </div>
              {/* O status terá uma classe dinâmica para aplicarmos cores diferentes com CSS */}
              <span className={`status status-${summary.status.toLowerCase()}`}>
                {summary.status === 'PENDING' && 'Pendente'}
                {summary.status === 'APPROVED' && 'Aprovado'}
                {summary.status === 'REJECTED' && 'Rejeitado'}
              </span>
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
