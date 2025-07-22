// src/pages/SubmitSummaryPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import './SubmitSummaryPage.css'; // Importa o CSS que também será atualizado

const SubmitSummaryPage = () => {
  const { state } = useLocation();
  const { signed } = useAuth();

  // --- ESTADOS ATUALIZADOS ---
  // Guardamos o 'slug' e a 'cover_url' que vêm dos livros existentes.
  // O 'slug' é a chave para sabermos se é uma criação ou uma atualização.
  const [slug, setSlug] = useState(state?.slug || null);
  const [existingCoverUrl, setExistingCoverUrl] = useState(state?.cover_url || null);

  const [title, setTitle] = useState(state?.title || '');
  const [author, setAuthor] = useState(state?.author || '');
  const [category, setCategory] = useState(state?.category || '');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null); // Usado apenas para novos livros
  const [mySummaries, setMySummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // A variável 'isUpdating' nos ajuda a deixar o código mais legível e a controlar o formulário
  const isUpdating = !!slug;

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

    // --- LÓGICA DE ENVIO ATUALIZADA ---
    if (isUpdating) {
      // --- LÓGICA PARA ATUALIZAR UM LIVRO EXISTENTE ---
      if (!content) {
        setError('Por favor, escreva o resumo.');
        return;
      }
      try {
        await api.put(`/books/${slug}`, { summary: content });
        setMessage('Resumo enviado para avaliação! Ele aparecerá na lista ao lado em breve.');
        setContent('');
        fetchMySummaries();
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Erro desconhecido ao enviar o resumo.';
        setError(errorMessage);
      }
    } else {
      // --- LÓGICA ORIGINAL PARA CRIAR UM NOVO LIVRO ---
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
        await api.post('/books', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMessage('Resumo enviado para avaliação! Ele aparecerá na lista ao lado em breve.');
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
        <h2>{isUpdating ? 'Complete o Resumo' : 'Envie seu Resumo'}</h2>
        <p>
          {isUpdating
            ? 'Este livro já está em nossa base. Adicione seu resumo para que ele possa ser avaliado e publicado.'
            : 'Após o envio, seu resumo será avaliado por nossa equipe. Se aprovado, será publicado com seu nome.'}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <input type="text" placeholder="Nome do Livro" value={title} onChange={e => setTitle(e.target.value)} required readOnly={isUpdating} />
          <input type="text" placeholder="Autor do Livro" value={author} onChange={e => setAuthor(e.target.value)} required readOnly={isUpdating} />
          <input type="text" placeholder="Categoria" value={category} onChange={e => setCategory(e.target.value)} required readOnly={isUpdating} />
          <textarea placeholder="Escreva seu resumo aqui..." value={content} onChange={e => setContent(e.target.value)} rows="8" required />

          {/* --- RENDERIZAÇÃO CONDICIONAL DA CAPA --- */}
          {isUpdating ? (
            <div className="existing-cover-wrapper">
              <p>Capa do Livro:</p>
              <img src={existingCoverUrl} alt={`Capa de ${title}`} className="existing-cover-preview" />
            </div>
          ) : (
            <>
              <label htmlFor="coverImage" className="file-upload-wrapper">
                {coverImage ? <p>{coverImage.name}</p> : <p>Clique para escolher a capa</p>}
                <span>JPEG ou PNG</span>
              </label>
              <input type="file" id="coverImage" name="coverImage" accept="image/jpeg, image/png" onChange={handleFileChange} required />
            </>
          )}

          <button type="submit">Enviar para Avaliação</button>

          {message && <p className="feedback-message success">{message}</p>}
          {error && <p className="feedback-message error">{error}</p>}
        </form>
      </div>

      <div className="my-summaries-section">
        <h3>Meus Envios:</h3>
        {loading ? (
          <p>Carregando seus envios...</p>
        ) : mySummaries.length > 0 ? (
          <ul className="summaries-list">
            {mySummaries.map(summary => (
              <li key={summary.id} className="summary-item">
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