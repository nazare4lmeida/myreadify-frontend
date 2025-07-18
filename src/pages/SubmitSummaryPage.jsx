import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './SubmitSummaryPage.css';

const SubmitSummaryPage = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  const [mySummaries, setMySummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verifica se o usuário está logado
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await api.get('/check-auth'); // Você pode adaptar essa rota
        setIsAuthenticated(response.data?.loggedIn || false);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkLogin();
  }, []);

  const fetchMySummaries = useCallback(async () => {
    try {
      const response = await api.get('/my-books');
      setMySummaries(response.data);
    } catch (err) {
      setError('Não foi possível carregar seus envios. Tente recarregar a página.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMySummaries();
    }
  }, [isAuthenticated, fetchMySummaries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!title || !author || !category || !content || !coverImage) {
      setError('Por favor, preencha todos os campos e selecione uma imagem de capa.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('category', category);
    formData.append('summary', content);
    formData.append('coverImage', coverImage);

    try {
      await api.post('/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Resumo enviado para avaliação! Ele aparecerá na lista abaixo em breve.');
      
      // Limpa o formulário
      setTitle('');
      setAuthor('');
      setCategory('');
      setContent('');
      setCoverImage(null);
      document.getElementById('coverImage').value = '';

      fetchMySummaries();

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Erro desconhecido ao enviar o resumo.';
      setError(errorMessage);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setCoverImage(e.target.files[0]);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="submit-summary-page not-logged-in">
        <h2>Envie seu Resumo</h2>
        <p>Para enviar resumos e acompanhar seus envios, é necessário estar logado.</p>
        <div className="auth-links">
          <Link to="/login" className="btn-login">Fazer Login</Link>
          <Link to="/register" className="btn-register">Cadastrar-se</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-summary-page">
      <div className="form-section">
        <h2>Envie seu Resumo</h2>
        <p>Após o envio, seu resumo será avaliado por nossa equipe. Se aprovado, será publicado com seu nome.</p>
        <form onSubmit={handleSubmit} noValidate>
          <input type="text" placeholder="Nome do Livro" value={title} onChange={e => setTitle(e.target.value)} required />
          <input type="text" placeholder="Autor do Livro" value={author} onChange={e => setAuthor(e.target.value)} required />
          <input type="text" placeholder="Categoria (Ex: Ficção, Negócios)" value={category} onChange={e => setCategory(e.target.value)} required />
          <textarea placeholder="Escreva seu resumo aqui..." value={content} onChange={e => setContent(e.target.value)} rows="8" required />
          
          <label htmlFor="coverImage" className="file-upload-wrapper">
            {coverImage ? (
                <p>{coverImage.name}</p>
            ) : (
                <p>Clique para escolher a capa</p>
            )}
            <span>JPEG ou PNG</span>
          </label>
          <input type="file" id="coverImage" name="coverImage" accept="image/jpeg, image/png" onChange={handleFileChange} required />
          
          <button type="submit">Enviar para Avaliação</button>

          {message && <p className="feedback-message success">{message}</p>}
          {error && <p className="feedback-message error">{error}</p>}
        </form>
      </div>

      <div className="my-summaries-section">
        <h3>Meus Envios</h3>
        {loading ? (
          <p>Carregando seus envios...</p>
        ) : mySummaries.length > 0 ? (
          <ul className="summaries-list">
            {mySummaries.map(summary => (
              <li key={summary.id} className={`summary-item`}>
                <div className="summary-info">
                  <strong>{summary.title}</strong>
                  <span>por {summary.author}</span>
                  <Link to={`/resumo/${summary.id}`} className="summary-link">Ver Resumo</Link>
                </div>
                <span className={`status status-${summary.status.toLowerCase()}`}>
                  {summary.status}
                </span>
              </li>
            ))}
          </ul>
        ) : <p>Você ainda não enviou nenhum resumo.</p>}
      </div>
    </div>
  );
};

export default SubmitSummaryPage;