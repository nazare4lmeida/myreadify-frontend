import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { useAuth } from '../contexts/AuthContext'; 
import './MySummariesPage.css'; 

const MySummariesPage = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { signed } = useAuth();

  useEffect(() => {
    if (signed) {
      const fetchMySummaries = async () => {
        try {
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
          {summaries.map(summary => (
            <li key={summary.id} className="summary-item">
              <div className="summary-info">
                <strong>{summary.title}</strong>
                <span>por {summary.author}</span>
              </div>
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
