// src/pages/SubmitSummaryPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './SubmitSummaryPage.css';

const SubmitSummaryPage = () => {
  // --- A CORREÇÃO ESTÁ AQUI ---
  // 1. Usamos o hook 'useLocation' para ler os dados passados na navegação.
  const { state } = useLocation();
  const { signed } = useAuth();

  // 2. Inicializamos os estados com os dados recebidos, se existirem.
  //    O 'state?.title' é uma forma segura de dizer "se o state existir, pegue o title".
  const [title, setTitle] = useState(state?.title || '');
  const [author, setAuthor] = useState(state?.author || '');
  const [category, setCategory] = useState(state?.category || ''); // Adicionado para a categoria
  
  // O resto do código continua exatamente como estava.
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [mySummaries, setMySummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchMySummaries = useCallback(async () => {
    setLoading(true); 
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
    if (signed) {
      fetchMySummaries();
    } else {
      setLoading(false);
    }
  }, [signed, fetchMySummaries]);

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
      
      setTitle('');
      setAuthor('');
      setCategory('');
      setContent('');
      setCoverImage(null);
      if (document.getElementById('coverImage')) {
        document.getElementById('coverImage').value = '';
      }
      
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

  if (!signed) {
    return (
      <div className="submit-summary-page not-logged-in container">
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
          {/* Os 'value' destes inputs agora usarão os estados pré-preenchidos */}
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