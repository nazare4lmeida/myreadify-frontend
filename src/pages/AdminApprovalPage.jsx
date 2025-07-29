// src/pages/AdminApprovalPage.jsx (VERSÃO FINAL COMPLETA E CORRIGIDA)

import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import './AdminApprovalPage.css';

// <<< 1. Adicionar a importação dinâmica de imagens do Vite >>>
// Isso permite que o Vite inclua as imagens de forma dinâmica no build.
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
  // Esta função agora lida tanto com URLs de upload (que começam com 'http')
  // quanto com caminhos de assets locais (do mockData).
  const resolveCoverUrl = (coverPath) => {
    // Se não houver caminho, retorna um placeholder genérico.
    if (!coverPath) return 'https://via.placeholder.com/150x220.png?text=Sem+Capa';
    // Se o caminho já for uma URL completa (ex: de um upload no Render/Supabase Storage), retorna-a diretamente.
    if (coverPath.startsWith('http')) return coverPath;

    // Se for um caminho relativo (como os do mockData, ex: 'lordoftherings.jpg'),
    // tenta resolver usando as imagens importadas pelo Vite.
    // Extrai apenas o nome do arquivo para formar a chave de importação.
    const imageName = coverPath.split('/').pop(); 
    const viteImagePath = `../assets/${imageName}`;
    
    // Verifica se a imagem foi encontrada no objeto de importação do Vite.
    if (images[viteImagePath]) {
      return images[viteImagePath].default; // Retorna a URL final da imagem local processada pelo Vite.
    } else {
      console.warn(`[AdminApprovalPage] Imagem do mock não encontrada! Procurando por: "${viteImagePath}". Caminho original: "${coverPath}"`);
      return 'https://via.placeholder.com/150x220.png?text=Capa+N%C3%A3o+Encontrada'; // Fallback se não encontrar.
    }
  };

  // As funções de manipulação (handleApprove, handleReject, etc.) estão corretas.
  const handleApprove = (summaryId) => {
    api.post(`/admin/summaries/${summaryId}/approve`)
      .then(() => {
        alert('Resumo aprovado com sucesso!');
        fetchData(); // Recarrega os dados após a aprovação
      })
      .catch(error => {
        alert(`Falha ao aprovar o resumo: ${error.response?.data?.error || error.message}`);
        console.error("Erro ao aprovar resumo:", error);
      });
  };

  const handleReject = (summaryId, bookTitle) => {
    if (window.confirm(`Tem certeza que deseja REJEITAR o resumo de "${bookTitle}"? Esta ação é irreversível.`)) {
      api.delete(`/admin/summaries/${summaryId}`)
        .then(() => {
          alert('Resumo rejeitado e removido com sucesso!');
          fetchData(); // Recarrega os dados após a rejeição
        })
        .catch(error => {
          alert(`Falha ao rejeitar o resumo: ${error.response?.data?.error || error.message}`);
          console.error("Erro ao rejeitar resumo:", error);
        });
    }
  };

  const handleTriggerUpload = (bookId) => {
    setSelectedBookId(bookId); // Armazena o ID do livro para o qual a capa será alterada.
    fileInputRef.current.click(); // Simula o clique no input de arquivo oculto.
  };

  const handleCoverFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedBookId) return; // Garante que um arquivo e um ID de livro foram selecionados.

    const formData = new FormData();
    formData.append('coverImage', file); // Adiciona o arquivo de imagem ao FormData.

    try {
      // <<< 4. Rota corrigida para o backend para atualizar a capa do livro >>>
      // Agora aponta para a rota PATCH '/admin/books/:bookId/cover'.
      await api.patch(`/admin/books/${selectedBookId}/cover`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Importante para enviar arquivos.
      });
      alert('Capa do livro atualizada com sucesso!');
      fetchData(); // Recarrega os dados para exibir a nova capa.
    } catch (error) {
      alert(`Erro ao enviar a nova capa: ${error.response?.data?.error || error.message}`);
      console.error("Erro ao enviar nova capa:", error);
    } finally {
      event.target.value = null; // Limpa o input de arquivo para que o mesmo arquivo possa ser selecionado novamente.
      setSelectedBookId(null); // Limpa o ID do livro selecionado.
    }
  };

  // Exibição de mensagens de carregamento e erro.
  if (isLoading) return <div className="container centered-message"><p>Carregando...</p></div>;
  if (error) return <div className="container centered-message error-message"><p>{error}</p></div>;

  return (
    <div className="admin-approval-page container">
      {/* Input de arquivo oculto para upload de capa, acionado por botão */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleCoverFileChange} 
        style={{ display: 'none' }} 
        accept="image/jpeg, image/png, image/webp" // Adicionado webp para mais flexibilidade
      />
      
      <div className="pending-section">
        <h2>Resumos Pendentes de Aprovação</h2>
        {pendingSummaries.length > 0 ? (
          <div className="pending-list">
            {pendingSummaries.map(summary => (
              <div key={summary.id} className="pending-card">
                <img 
                  // <<< 3. Usar a nova função para obter a URL correta >>>
                  src={resolveCoverUrl(summary.book?.cover_url)} 
                  alt={`Capa de ${summary.book?.title || 'Livro sem título'}`} 
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
                    {/* Botão para alterar a capa, aciona o input de arquivo */}
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
      <hr className="section-divider" /> {/* Linha divisória para separar as seções */}
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
                  {/* Exibe o status do resumo com classes CSS para estilização */}
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
