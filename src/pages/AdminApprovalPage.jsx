// src/pages/AdminApprovalPage.jsx (VERSÃO FINAL COMPLETA E CORRIGIDA)

import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import './AdminApprovalPage.css';

// <<< 1. Adicionar a importação dinâmica de imagens do Vite >>>
const images = import.meta.glob('../assets/*.jpg', { eager: true });

const AdminApprovalPage = () => {
  const [pendingSummaries, setPendingSummaries] = useState([]);
  const [allSummaries, setAllSummaries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const [selectedBookId, setSelectedBookId] = useState(null);

  // A função fetchData está correta e não precisa de alterações.
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

  // <<< 2. Criar a função inteligente para resolver a URL da imagem >>>
  const resolveCoverUrl = (coverPath) => {
    if (!coverPath) return 'https://via.placeholder.com/150x220.png?text=Sem+Capa';
    if (coverPath.startsWith('http')) return coverPath;

    const imageName = coverPath.split('/').pop();
    const viteImagePath = `../assets/${imageName}`;
    
    if (images[viteImagePath]) {
      return images[viteImagePath].default;
    } else {
      console.warn(`[AdminApprovalPage] Imagem do mock não encontrada: "${viteImagePath}"`);
      return 'https://via.placeholder.com/150x220.png?text=Capa+N%C3%A3o+Encontrada';
    }
  };

  // As funções de manipulação (handleApprove, handleReject, etc.) estão corretas.
  const handleApprove = (summaryId) => {
    api.post(`/admin/summaries/${summaryId}/approve`)
      .then(() => {
        alert('Resumo aprovado com sucesso!');
        fetchData();
      })
      .catch(error => {
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
          alert('Falha ao rejeitar o resumo.');
        });
    }
  };

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
      await api.patch(`/admin/books/${selectedBookId}/cover`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Capa do livro atualizada com sucesso!');
      fetchData();
    } catch (error) {
      alert('Erro ao enviar a nova capa.');
    } finally {
      event.target.value = null; 
      setSelectedBookId(null);
    }
  };

  if (isLoading) return <div className="container centered-message"><p>Carregando...</p></div>;
  if (error) return <div className="container centered-message error-message"><p>{error}</p></div>;

  return (
    <div className="admin-approval-page container">
      <input type="file" ref={fileInputRef} onChange={handleCoverFileChange} style={{ display: 'none' }} accept="image/jpeg, image/png" />
      <div className="pending-section">
        <h2>Resumos Pendentes de Aprovação</h2>
        {pendingSummaries.length > 0 ? (
          <div className="pending-list">
            {pendingSummaries.map(summary => (
              <div key={summary.id} className="pending-card">
                <img 
                  // <<< 3. Usar a nova função para obter a URL correta >>>
                  src={resolveCoverUrl(summary.book?.cover_url)} 
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