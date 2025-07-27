import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import './AdminApprovalPage.css';

const AdminApprovalPage = () => {
  // >>> ALTERAÇÃO 1: Renomeando estados para refletir que estamos lidando com resumos <<<
  const [pendingSummaries, setPendingSummaries] = useState([]);
  const [allSummaries, setAllSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // O resto dos estados continua o mesmo
  const fileInputRef = useRef(null);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const fetchData = () => {
    setIsLoading(true);
    // >>> ALTERAÇÃO 2: Garantindo que ambas as rotas são de resumos <<<
    Promise.all([
      api.get('/admin/pending-summaries'),
      api.get('/admin/all-summaries') // Você precisará criar esta rota e controller no backend
    ])
    .then(([pendingResponse, allResponse]) => {
      setPendingSummaries(pendingResponse.data);
      setAllSummaries(allResponse.data);
    })
    .catch(error => {
      console.error("Erro ao buscar dados de admin:", error);
      // Fallback para evitar que a página quebre se uma das rotas falhar
      if (error.config.url.includes('pending')) setPendingSummaries([]);
      if (error.config.url.includes('all')) setAllSummaries([]);
    })
    .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // >>> ALTERAÇÃO 3: Corrigindo a lógica de atualização para resumos <<<
  const handleUpdateStatus = (summaryId, newStatus) => {
    api.patch(`/admin/summaries/${summaryId}/status`, { status: newStatus })
      .then(() => {
        fetchData(); 
      })
      .catch(error => {
        alert(`Falha ao atualizar o status do resumo.`);
      });
  };

  const handleDeleteSummary = (summaryId, bookTitle) => {
    if (window.confirm(`Tem certeza que deseja deletar permanentemente o resumo de "${bookTitle}"?`)) {
      api.delete(`/admin/summaries/${summaryId}`)
        .then(() => {
          fetchData();
        })
        .catch(error => {
          alert('Falha ao deletar o resumo.');
        });
    }
  };

  const handleTriggerUpload = (bookId) => {
    setSelectedBookId(bookId);
    fileInputRef.current.click();
  };

  const handleCoverFileChange = async (event) => {
    // A lógica de upload de capa continua a mesma, pois ela se aplica a um 'book'
    const file = event.target.files[0];
    if (!file || !selectedBookId) return;
    const formData = new FormData();
    formData.append('coverImage', file);
    try {
      await api.patch(`/admin/books/${selectedBookId}/cover`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Capa do livro atualizada com sucesso!');
      fetchData();
    } catch (error) {
      alert('Erro ao enviar a nova capa.');
      console.error(error);
    } finally {
      event.target.value = null;
      setSelectedBookId(null);
    }
  };

  if (isLoading) return <div className="container"><p>Carregando dados de administração...</p></div>;

  return (
    <div className="admin-approval-page container">
      <input type="file" ref={fileInputRef} onChange={handleCoverFileChange} style={{ display: 'none' }} accept="image/jpeg, image/png" />

      <div className="pending-section">
        <h2>Resumos Pendentes de Aprovação</h2>
        {pendingSummaries.length > 0 ? (
          <div className="pending-list">
            {/* >>> ALTERAÇÃO 4: Mapeando 'pendingSummaries' e usando dados de resumo <<< */}
            {pendingSummaries.map(summary => (
              <div key={summary.id} className="pending-card">
                <img 
                  src={`http://localhost:3333/files/${summary.book?.cover_url}` || 'caminho/para/imagem/padrao.png'} 
                  alt={`Capa de ${summary.book?.title}`} 
                  className="book-cover-thumbnail"
                />
                <div className="card-content">
                  <h3>{summary.book?.title}</h3>
                  <p><strong>Autor:</strong> {summary.book?.author}</p>
                  <p><strong>Enviado por:</strong> {summary.user?.name}</p>
                  <p className="summary-content">{summary.content}</p>
                  <div className="approval-actions">
                    <button onClick={() => handleUpdateStatus(summary.id, 'COMPLETED')} className="btn-approve">Aprovar</button>
                    <button onClick={() => handleUpdateStatus(summary.id, 'REJECTED')} className="btn-reject">Recusar</button>
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

      <div className="management-section">
        <h2>Gerenciar Todos os Resumos</h2>
        {allSummaries.length > 0 ? (
          <ul className="management-list">
            {/* >>> ALTERAÇÃO 5: Mapeando 'allSummaries' e usando dados de resumo <<< */}
            {allSummaries.map(summary => (
              <li key={summary.id} className="management-item">
                <div className="item-info">
                  <span className="item-title">{summary.book?.title}</span>
                  <span className="item-id">(ID do Resumo: {summary.id})</span>
                </div>
                <div className="item-actions">
                  <span className={`item-status status-${summary.status?.toLowerCase()}`}>{summary.status}</span>
                  <button onClick={() => handleTriggerUpload(summary.book?.id)} className="btn-change-cover">Alterar Capa</button>
                  <button onClick={() => handleDeleteSummary(summary.id, summary.book?.title)} className="btn-delete-permanent">Deletar</button>
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