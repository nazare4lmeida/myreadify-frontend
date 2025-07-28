// SubmitSummaryPage.js

import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./SubmitSummaryPage.css";

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
    if (signed) {
      fetchMySummaries();
    } else {
      setLoadingMySummaries(false);
    }
  }, [signed, fetchMySummaries]);

  const getCoverUrl = () => {
    if (!prefilledBook?.cover_url) return null;

    if (prefilledBook.cover_url.includes("/src/assets/")) {
      return prefilledBook.cover_url.replace("/src/assets/", "/assets/");
    }

    if (prefilledBook.cover_url.startsWith("http")) {
      return prefilledBook.cover_url;
    }

    return `http://localhost:3333/files/${prefilledBook.cover_url}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      if (isUpdating) {
        // 🧠 CENÁRIO 1: Livro vindo do mock (já tem id, slug, cover_url)
        if (!content) {
          setError("Por favor, escreva o resumo.");
          setIsSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append("bookId", prefilledBook.id);
        formData.append("title", prefilledBook.title);
        formData.append("author", prefilledBook.author);
        formData.append("category", prefilledBook.category);
        formData.append("summary_text", content);

        // 🔍 Adiciona a capa apenas se não for uma URL externa (mock/local)
        if (!prefilledBook.cover_url.startsWith("http")) {
          const response = await fetch(getCoverUrl());
          const blob = await response.blob();
          const file = new File([blob], prefilledBook.cover_url, {
            type: blob.type,
          });
          formData.append("coverImage", file);
        }

        await api.post("/summaries", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("Resumo enviado com sucesso!");
        navigate(`/livro/${prefilledBook.slug}`);
        return;
      }

      // 🧠 CENÁRIO 2: Livro criado do zero (sem id/slug)
      if (!title || !author || !category || !content || !coverImage) {
        setError("Por favor, preencha todos os campos e selecione uma imagem.");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("category", category);
      formData.append("summary_text", content);
      formData.append("coverImage", coverImage);

      await api.post("/summaries", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Seu novo livro e resumo foram enviados para avaliação!");
      setTitle("");
      setAuthor("");
      setCategory("");
      setContent("");
      setCoverImage(null);
      document.getElementById("coverImage").value = "";

      fetchMySummaries();
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Erro desconhecido ao enviar.";
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
        <p>
          Para enviar resumos e acompanhar seus envios, é necessário estar
          logado.
        </p>
        <div className="auth-links">
          <Link to="/login" className="btn-login">
            Fazer Login
          </Link>
          <Link to="/register" className="btn-register">
            Cadastrar-se
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="submit-summary-page">
      <div className="form-section">
        <h2>{isUpdating ? "Complete o Resumo" : "Envie seu Resumo"}</h2>
        <p>
          {isUpdating
            ? `Você está enviando um resumo para o livro "${prefilledBook.title}". As informações do livro não podem ser alteradas.`
            : "Após o envio, seu resumo será avaliado por nossa equipe. Se aprovado, será publicado com seu nome."}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <input
            type="text"
            placeholder="Nome do Livro"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            readOnly={isUpdating}
          />
          <input
            type="text"
            placeholder="Autor do Livro"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            readOnly={isUpdating}
          />
          <input
            type="text"
            placeholder="Categoria"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            readOnly={isUpdating}
          />
          <textarea
            placeholder="Escreva seu resumo aqui..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="8"
            required
          />

          {isUpdating ? (
            <div className="input-group">
              <label>Capa do Livro:</label>
              <div className="file-upload-wrapper static-preview">
                {getCoverUrl() ? (
                  <img
                    src={getCoverUrl()}
                    alt={`Capa de ${title}`}
                    className="existing-cover-preview"
                  />
                ) : (
                  <p style={{ fontStyle: "italic" }}>Capa não disponível.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="input-group">
              <label htmlFor="coverImage" className="file-upload-wrapper">
                {coverImage ? (
                  <p>{coverImage.name}</p>
                ) : (
                  <p>Clique para escolher a capa</p>
                )}
                <span>JPEG ou PNG</span>
              </label>
              <input
                type="file"
                id="coverImage"
                name="coverImage"
                accept="image/jpeg, image/png"
                onChange={handleFileChange}
                required
              />
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
                  <span
                    className={`status status-${summary.status.toLowerCase()}`}
                  >
                    {summary.status}
                  </span>
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
