import React, { useState, useEffect, useCallback } from 'react'; 
import api from '../services/api';
import './AdminMessagesPage.css';

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [replyingMessage, setReplyingMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/admin/messages');
      setMessages(response.data);
      setError(null);
    } catch (err) {
      setError('Não foi possível carregar as mensagens. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = async (messageId) => {
    if (!window.confirm('Tem certeza que deseja deletar esta mensagem permanentemente?')) {
      return;
    }
    try {
      await api.delete(`/admin/messages/${messageId}`);
      fetchMessages(); 
    } catch (err) {
      alert('Falha ao deletar a mensagem.');
      console.error(err);
    }
  };

  const handleStartReply = (message) => {
    setReplyingMessage(message);
  };
  
  const handleSendReply = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await api.post(`/admin/messages/${replyingMessage.id}/reply`, { replyText });
      alert('Resposta enviada com sucesso!');
      
      fetchMessages();

      setReplyingMessage(null);
      setReplyText('');

    } catch (err) {
      alert('Falha ao enviar a resposta.');
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <div className="admin-container"><p>Carregando mensagens...</p></div>;
  }

  if (error) {
    return <div className="admin-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="admin-messages-page">
      <div className="admin-container">
        <h1 className="admin-title">Caixa de Entrada</h1>
        {messages.length === 0 ? (
          <p>Nenhuma mensagem recebida ainda.</p>
        ) : (
          <div className="messages-list">
            {messages.map(msg => (
              <div key={msg.id} className={`message-card ${!msg.is_read ? 'unread' : ''}`}>
                <div className="message-header">
                  <div className="message-info">
                    <strong>De:</strong> {msg.name} ({msg.email})<br />
                    <strong>Assunto:</strong> {msg.subject}
                  </div>
                  <div className="message-date">
                    {new Date(msg.createdAt).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="message-body">
                  <p>{msg.message}</p>
                </div>
                <div className="message-actions">
                  <button className="action-button reply" onClick={() => handleStartReply(msg)}>Responder</button>
                  <button className="action-button delete" onClick={() => handleDelete(msg.id)}>Deletar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {replyingMessage && (
        <div className="reply-modal-overlay">
          <div className="reply-modal">
            <h3>Respondendo a {replyingMessage.name}</h3>
            <p className="original-subject">Assunto: {replyingMessage.subject}</p>
            <form onSubmit={handleSendReply}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows="8"
                placeholder="Escreva sua resposta aqui..."
                required
              ></textarea>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setReplyingMessage(null)} disabled={isSending}>
                  Cancelar
                </button>
                <button type="submit" className="btn-send" disabled={isSending}>
                  {isSending ? 'Enviando...' : 'Enviar Resposta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessagesPage;