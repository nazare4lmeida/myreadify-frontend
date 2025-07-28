// src/pages/SubmitSummaryPage.jsx (VERSÃO FINAL COMPLETA PARA SUBSTITUIÇÃO)

import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./SubmitSummaryPage.css";

const images = import.meta.glob('../assets/*.jpg', { eager: true });

const SubmitSummaryPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { signed } = useAuth();
  const prefilledBook = state?.book;
  const isUpdating = !!prefilledBook;
  const [title, setTitle] = useState(prefilledBook?.title || "");
  const [author, setAuthor] = useState(prefilledBook?.author || "");
  const [category, setCategory] = useState(prefilledBook?.category || "");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [mySummaries, setMySummaries] = useState([]);
  const [loadingMySummaries, setLoadingMySummaries] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resolvedCoverUrl, setResolvedCoverUrl] = useState('');

  const fetchMySummaries = useCallback(async () => {
    setLoadingMySummaries(true);
    try {
      const response = await api.get("/my-summaries");
      setMySummaries(response.data);
    } catch (err) {
      console.error("Falha ao buscar envios:", err);
    } finally {
      setLoadingMySummaries(false);
    }
  }, []);

  useEffect(() => {
    if (prefilledBook?.cover_url) {
      const path = prefilledBook.cover_url;
      if (path.startsWith('http')) {
        setResolvedCoverUrl(path);
      } else {
        const imageName = path.split('/').pop();
        const viteImagePath = `../assets/${imageName}`;
        setResolvedCoverUrl(images[viteImagePath]?.default || '');
      }
    }
  }, [prefilledBook]);

  useEffect(() => {
    if (signed) {
      fetchMySummaries();
    } else {
      setLoadingMySummaries(false);
    }
  }, [signed, fetchMySummaries]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("content", content);
    
    if (isUpdating && prefilledBook.slug) {
        formData.append('slug', prefilledBook.slug);
    }

    if (isUpdating) {
        // <<< A CORREÇÃO FINAL ESTÁ AQUI >>>
        // Em vez de enviar o caminho completo, extraímos e enviamos SÓ o nome do arquivo.
        const imageName = prefilledBook.cover_url.split('/').pop();
        formData.append('coverUrlMock', imageName); 
    } else if (coverImage) {
        formData.append("coverImage", coverImage);
    } else {
        setError("Para um novo livro, a imagem da capa é obrigatória.");
        setIsSubmitting(false);
        return;
    }
    
    try {
        await api.post("/summaries", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Resumo enviado para avaliação com sucesso!");
        navigate("/meus-resumos");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Erro desconhecido ao enviar.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
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
        <h2>{isUpdating ? "Complete o Resumo" : "Envie um Novo Resumo"}</h2>
        <p>
          {isUpdating
            ? `Você está enviando um resumo para o livro "${prefilledBook.title}".`
            : "Preencha todos os campos. Após o envio, seu resumo será avaliado."}
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <input type="text" placeholder="Nome do Livro" value={title} onChange={(e) => setTitle(e.target.value)} required readOnly={isUpdating} />
          <input type="text" placeholder="Autor do Livro" value={author} onChange={(e) => setAuthor(e.target.value)} required readOnly={isUpdating} />
          <input type="text" placeholder="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} required readOnly={isUpdating} />
          <textarea placeholder="Escreva seu resumo aqui..." value={content} onChange={(e) => setContent(e.target.value)} rows="8" required />
          {isUpdating ? (
            <div className="input-group">
              <label>Capa do Livro:</label>
              <div className="file-upload-wrapper static-preview">
                {resolvedCoverUrl ? (
                  <img src={resolvedCoverUrl} alt={`Capa de ${title}`} className="existing-cover-preview" />
                ) : (
                  <p style={{ fontStyle: "italic" }}>Capa não disponível.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="input-group">
              <label htmlFor="coverImage" className="file-upload-wrapper">
                {coverImage ? <p>{coverImage.name}</p> : <p>Clique para escolher a capa</p>}
                <span>JPEG ou PNG</span>
              </label>
              <input type="file" id="coverImage" name="coverImage" accept="image/jpeg, image/png" onChange={handleFileChange} required />
            </div>
          )}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar para Avaliação"}
          </button>
          {message && <p className="feedback-message success">{message}</p>}
          {error && <p className="feedback-message error">{error}</p>}
        </form>
      </div>
      <div className="my-summaries-section">
        <h3>Meus Envios:</h3>
        {loadingMySummaries ? (
          <p>Carregando seus envios...</p>
        ) : mySummaries.length > 0 ? (
          <ul className="summaries-list">
            {mySummaries.map((summary) => (
              <li key={summary.id} className="summary-item">
                <div className="summary-info">
                  <strong>{summary.title}</strong>
                  <span>por {summary.author}</span>
                </div>
                {typeof summary.status === "string" && (
                  <span className={`status status-${summary.status.toLowerCase()}`}>{summary.status}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Você ainda não enviou nenhum resumo.</p>
        )}
      </div>
    </div>
  );
};

export default SubmitSummaryPage;