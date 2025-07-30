// src/pages/SubmitSummaryPage.jsx (VERSÃO FINAL COMPLETA E CORRIGIDA)

import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./SubmitSummaryPage.css";
import { getImageUrl } from '../utils/imageUtils'; // Importe a nova função utilitária

const SubmitSummaryPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { signed } = useAuth();
  const prefilledBook = state?.book; // Agora recebe o objeto 'book' completo
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
    // Este useEffect não precisa mais de lógica de resolução de URL,
    // pois getImageUrl será usado diretamente no JSX.
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
    setMessage(""); // Limpa mensagem de sucesso anterior

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("category", category);
    formData.append("content", content);
    
    if (isUpdating && prefilledBook.slug) {
        formData.append('slug', prefilledBook.slug);
    }

    if (isUpdating) {
        // Para livros existentes (mockdata), coverUrlMock será o nome do arquivo da capa
        // que já está em prefilledBook.cover_url (ex: '/src/assets/images/covers/lordoftherings.jpg')
        // O backend espera apenas o nome do arquivo do asset para mockdata.
        const filename = prefilledBook.cover_url.split('/').pop(); 
        formData.append('coverUrlMock', filename); 
    } else if (coverImage) {
        formData.append("coverImage", coverImage);
    } else {
        setError("Para um novo livro, a imagem da capa é obrigatória.");
        setIsSubmitting(false);
        return;
    }
    
    if (!title || !author || !category || !content) {
        setError("Por favor, preencha todos os campos obrigatórios.");
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
        { prefilledBook && ( // Se houver um livro pré-preenchido, exibe a capa mesmo não logado
          <div className="prefilled-book-info">
            <img src={getImageUrl(prefilledBook)} alt={`Capa de ${prefilledBook.title}`} className="prefilled-book-cover" />
            <p>Livro: <strong>{prefilledBook.title}</strong> por {prefilledBook.author}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="submit-summary-page">
      <div className="form-section">
        <h2>{isUpdating ? "Complete o Resumo" : "Envie um Novo Resumo"}</h2>
        <p>
          {isUpdating
            ? `Você está enviando um resumo para o livro "${prefilledBook?.title}".`
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
                {prefilledBook?.cover_url ? ( 
                  <img src={getImageUrl(prefilledBook)} alt={`Capa de ${title}`} className="existing-cover-preview" /> 
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
                <Link
                  to={summary.slug ? `/livro/${summary.slug}` : '#'} 
                  className="summary-link-wrapper"
                >
                  <img
                    src={getImageUrl(summary)} 
                    alt={`Capa do livro ${summary.title}`} 
                    className="summary-cover-image"
                  />
                  <div className="summary-info">
                    <strong>{summary.title}</strong> 
                    <span>por {summary.author}</span> 
                  </div>
                  {typeof summary.status === "string" && (
                    <span className={`status status-${summary.status.toLowerCase()}`}>{summary.status === "PENDING" ? "PENDING" : summary.status}</span>
                  )}
                </Link>
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
