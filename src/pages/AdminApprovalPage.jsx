import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './AdminApprovalPage.css';

const AdminApprovalPage = () => {
  const [pendingBooks, setPendingBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
        fetchData();
      })
      .catch(error => {
        alert(`Falha ao ${newStatus === 'APPROVED' ? 'aprovar' : 'recusar'} o resumo.`);
      });
  };

  const handleDeleteBook = (bookId, bookTitle) => {
    if (window.confirm(`Tem certeza que deseja deletar permanentemente o resumo de "${bookTitle}"?`)) {
      api.delete(`/admin/books/${bookId}`)
        .then(() => {
          setAllBooks(currentBooks => currentBooks.filter(book => book.id !== bookId));
          setPendingBooks(currentPending => currentPending.filter(book => book.id !== bookId));
        })
        .catch(error => {
          alert('Falha ao deletar o resumo.');
        });
    }
  };

  if (isLoading) return <div className="container"><p>Carregando dados de administração...</p></div>;

  return (
    <div className="admin-approval-page container">
      <div className="pending-section">
        <h2>Resumos Pendentes de Aprovação</h2>
        {pendingBooks.length > 0 ? (
          <div className="pending-list">
            {pendingBooks.map(book => (
              <div key={book.id} className="pending-card">
                <h3>{book.title}</h3>
                <p><strong>Autor:</strong> {book.author}</p>
                <p><strong>Enviado por:</strong> {book.submitter.name}</p>
                <p className="summary-content">{book.summary}</p>
                <div className="approval-actions">
                  <button onClick={() => handleUpdateStatus(book.id, 'APPROVED')} className="btn-approve">Aprovar</button>
                  <button onClick={() => handleUpdateStatus(book.id, 'REJECTED')} className="btn-reject">Recusar</button>
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