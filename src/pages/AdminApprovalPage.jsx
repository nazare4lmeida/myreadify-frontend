// src/pages/AdminApprovalPage.jsx (VERSÃO FINAL COMPLETA COM "ALTERAR CAPA")

import React, { useState, useEffect, useRef } from 'react'; // <<< 1. useRef re-adicionado
import api from '../services/api';
import './AdminApprovalPage.css';

const AdminApprovalPage = () => {
  const [pendingSummaries, setPendingSummaries] = useState([]);
  const [allSummaries, setAllSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // <<< 2. Estados e ref para o upload re-adicionados >>>
  const fileInputRef = useRef(null);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const fetchData = () => {
    setIsLoading(true);
    setError('');

    Promise.all([
      api.get('/admin/pending-summaries'),
      api.get('/admin/all-summaries')
    ])
    .then(([pendingResponse, allResponse]) => {
      setPendingSummaries(pendingResponse.data);
      setAllSummaries(allResponse.data);
    })
    .catch(err => {
      console.error("Erro ao buscar dados de admin:", err);
      setError("Não foi possível carregar os dados. Tente recarregar a página.");
    })
    .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = (summaryId) => {
    api.post(`/admin/summaries/${summaryId}/approve`)
      .then(() => {
        alert('Resumo aprovado com sucesso!');
        fetchData();
      })
      .catch(error => {
        console.error("Erro ao aprovar resumo:", error);
        alert(`Falha ao aprovar o resumo.`);
      });
  };

  const handleReject = (summaryId, bookTitle) => {
    if (window.confirm(`Tem certeza que deseja REJEITAR o resumo de "${bookTitle}"?`)) {
      api.delete(`/admin/summaries/${summaryId}`)
        .then(() => {
          alert('Resumo rejeitado com sucesso!');
          fetchData();
        })
        .catch(error => {
          console.error("Erro ao rejeitar resumo:", error);
          alert('Falha ao rejeitar o resumo.');
        });
    }
  };

  // <<< 3. Lógica para o upload da capa re-adicionada >>>
  const handleTriggerUpload = (bookId) => {
    setSelectedBookId(bookId);
    fileInputRef.current.click();
  };

  const handleCoverFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedBookId) return;

    const formData = new FormData();
    formData.append('coverImage', file);

    try {
      // A rota do backend para atualizar a capa do livro
      await api.patch(`/admin/books/${selectedBookId}/cover`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Capa do livro atualizada com sucesso!');
      fetchData(); // Recarrega os dados para mostrar a nova capa
    } catch (error) {
      alert('Erro ao enviar a nova capa.');
      console.error(error);
    } finally {
      // Limpa o input para permitir o upload do mesmo arquivo novamente
      event.target.value = null; 
      setSelectedBookId(null);
    }
  };


  if (isLoading) return <div className="container centered-message"><p>Carregando dados de administração...</p></div>;
  if (error) return <div className="container centered-message error-message"><p>{error}</p></div>;

  return (
    <div className="admin-approval-page container">
      {/* O input de arquivo oculto */}
      <input type="file" ref={fileInputRef} onChange={handleCoverFileChange} style={{ display: 'none' }} accept="image/jpeg, image/png" />

      <div className="pending-section">
        <h2>Resumos Pendentes de Aprovação</h2>
        {pendingSummaries.length > 0 ? (
          <div className="pending-list">
            {pendingSummaries.map(summary => (
              <div key={summary.id} className="pending-card">
                <img 
                  src={summary.book?.cover_url || 'https://via.placeholder.com/150x220.png?text=Sem+Capa'} 
                  alt={`Capa de ${summary.book?.title}`} 
                  className="book-cover-thumbnail"
                />
                <div className="card-content">
                  <h3>{summary.book?.title}</h3>
                  <p><strong>Autor:</strong> {summary.book?.author}</p>
                  <p><strong>Enviado por:</strong> {summary.user?.name}</p>
                  <p className="summary-content">{summary.content}</p>
                  <div className="approval-actions">
                    <button onClick={() => handleApprove(summary.id)} className="btn-approve">Aprovar</button>
                    <button onClick={() => handleReject(summary.id, summary.book?.title)} className="btn-reject">Recusar</button>
                    {/* <<< 4. Botão "Alterar Capa" de volta ao card >>> */}
                    <button onClick={() => handleTriggerUpload(summary.book?.id)} className="btn-change-cover">Alterar Capa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
            <p className="empty-message">Não há nenhum resumo pendente no momento.</p>
        )}
      </div>

      <hr className="section-divider" />

      {/* A seção de "Gerenciar Todos os Resumos" continua a mesma */}
      <div className="management-section">
        <h2>Gerenciar Todos os Resumos</h2>
        {allSummaries.length > 0 ? (
          <ul className="management-list">
            {allSummaries.map(summary => (
              <li key={summary.id} className="management-item">
                <div className="item-info">
                  <span className="item-title">{summary.book?.title}</span>
                  <span className="item-id">(Enviado por: {summary.user?.name})</span>
                </div>
                <div className="item-actions">
                  <span className={`item-status status-${summary.status?.toLowerCase()}`}>{summary.status}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-message">Nenhum resumo encontrado no sistema.</p>
        )}
      </div>
    </div>
  );
};

export default AdminApprovalPage;