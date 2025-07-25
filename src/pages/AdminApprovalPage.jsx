import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import './AdminApprovalPage.css';

const AdminApprovalPage = () => {
  const [pendingBooks, setPendingBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- ALTERAÇÕES NO FRONTEND ---
  const fileInputRef = useRef(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  // --- FIM DAS ALTERAÇÕES ---

  const fetchData = () => {
    setIsLoading(true);
    Promise.all([
      api.get('/admin/pending-books'),
      api.get('/admin/all-books')
    ])
    .then(([pendingResponse, allResponse]) => {
      setPendingBooks(pendingResponse.data);
      setAllBooks(allResponse.data);
    })
    .catch(error => console.error("Erro ao buscar dados de admin:", error))
    .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = (bookId, newStatus) => {
    api.patch(`/admin/books/${bookId}/status`, { status: newStatus })
      .then(() => {
        fetchData(); // Recarrega os dados para refletir a mudança de status
      })
      .catch(error => {
        alert(`Falha ao ${newStatus === 'APPROVED' ? 'aprovar' : 'recusar'} o resumo.`);
      });
  };

  const handleDeleteBook = (bookId, bookTitle) => {
    if (window.confirm(`Tem certeza que deseja deletar permanentemente o resumo de "${bookTitle}"?`)) {
      api.delete(`/admin/books/${bookId}`)
        .then(() => {
          fetchData(); // Recarrega os dados após deletar
        })
        .catch(error => {
          alert('Falha ao deletar o resumo.');
        });
    }
  };

  // --- NOVAS FUNÇÕES PARA ATUALIZAR A CAPA ---
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
      // Usando o novo endpoint PATCH
      await api.patch(`/admin/books/${selectedBookId}/cover`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Capa do livro atualizada com sucesso!');
      fetchData(); // Recarrega os dados para mostrar a nova capa se necessário
    } catch (error) {
      alert('Erro ao enviar a nova capa. Verifique o console para mais detalhes.');
      console.error(error);
    } finally {
      // Limpa o input para permitir uploads futuros do mesmo arquivo
      event.target.value = null;
      setSelectedBookId(null);
    }
  };
  // --- FIM DAS NOVAS FUNÇÕES ---

  if (isLoading) return <div className="container"><p>Carregando dados de administração...</p></div>;

  return (
    <div className="admin-approval-page container">

      {/* Input de arquivo invisível que será usado pelos botões */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCoverFileChange}
        style={{ display: 'none' }}
        accept="image/jpeg, image/png"
      />

      <div className="pending-section">
        <h2>Resumos Pendentes de Aprovação</h2>
        {pendingBooks.length > 0 ? (
          <div className="pending-list">
            {pendingBooks.map(book => (
              <div key={book.id} className="pending-card">
                <img 
                  src={book.full_cover_url || 'caminho/para/imagem/padrao.png'} 
                  alt={`Capa de ${book.title}`} 
                  className="book-cover-thumbnail"
                />
                <div className="card-content">
                  <h3>{book.title}</h3>
                  <p><strong>Autor:</strong> {book.author}</p>
                  <p><strong>Enviado por:</strong> {book.submitter.name}</p>
                  <p className="summary-content">{book.summary}</p>
                  <div className="approval-actions">
                    <button onClick={() => handleUpdateStatus(book.id, 'APPROVED')} className="btn-approve">Aprovar</button>
                    <button onClick={() => handleUpdateStatus(book.id, 'REJECTED')} className="btn-reject">Recusar</button>
                    <button onClick={() => handleTriggerUpload(book.id)} className="btn-change-cover">Alterar Capa</button>
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
        {allBooks.length > 0 ? (
          <ul className="management-list">
            {allBooks.map(book => (
              <li key={book.id} className="management-item">
                <div className="item-info">
                  <span className="item-title">{book.title}</span>
                  <span className="item-id">(ID: {book.id})</span>
                </div>
                <div className="item-actions">
                  <span className={`item-status status-${book.status.toLowerCase()}`}>{book.status}</span>
                  {/* BOTÃO PARA ALTERAR A CAPA */}
                  <button
                    onClick={() => handleTriggerUpload(book.id)}
                    className="btn-change-cover"
                  >
                    Alterar Capa
                  </button>
                  <button 
                    onClick={() => handleDeleteBook(book.id, book.title)} 
                    className="btn-delete-permanent"
                  >
                    Deletar
                  </button>
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