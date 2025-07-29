// src/pages/SubmitSummaryPage.jsx (VERSÃO FINAL COMPLETA PARA SUBSTITUIÇÃO)

import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "./SubmitSummaryPage.css";

// Importação dinâmica de imagens para o Vite.
// Isso é necessário para que o Vite processe corretamente as referências a imagens locais.
const images = import.meta.glob('../assets/*.jpg', { eager: true });

const SubmitSummaryPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { signed } = useAuth();

  // CORREÇÃO PRINCIPAL: Garante que o 'book' é o objeto completo passado via state
  const prefilledBook = state?.book; 
  const isUpdating = !!prefilledBook; // Usamos 'isUpdating' para indicar que estamos adicionando um resumo a um livro existente.

  const [title, setTitle] = useState(prefilledBook?.title || "");
  const [author, setAuthor] = useState(prefilledBook?.author || "");
  const [category, setCategory] = useState(prefilledBook?.category || "");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null); // Para upload de novas capas de livros
  const [mySummaries, setMySummaries] = useState([]);
  const [loadingMySummaries, setLoadingMySummaries] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  // Estado para a URL da capa exibida (seja do mock ou da API)
  const [resolvedCoverUrl, setResolvedCoverUrl] = useState(''); 

  // Função para buscar os resumos do usuário
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

  // Efeito para resolver a URL da capa do livro pré-preenchido
  useEffect(() => {
    if (prefilledBook?.cover_url) {
      // Usa a função de resolução inteligente para obter a URL correta
      setResolvedCoverUrl(resolveCoverUrl(prefilledBook.cover_url));
    } else {
      setResolvedCoverUrl(''); // Limpa se não houver capa
    }
  }, [prefilledBook]); // Depende do livro pré-preenchido

  // Efeito para buscar os resumos do usuário quando o status de login muda
  useEffect(() => {
    if (signed) {
      fetchMySummaries();
    } else {
      setLoadingMySummaries(false);
    }
  }, [signed, fetchMySummaries]);

  // Função para resolver a URL da capa de forma inteligente (copiada de outras pages)
  const resolveCoverUrl = (coverPath) => {
    if (!coverPath) return 'https://via.placeholder.com/150x220.png?text=Sem+Capa';
    if (coverPath.startsWith('http')) {
      return coverPath;
    }
    const imageName = coverPath.split('/').pop();
    const viteImagePath = `../assets/${imageName}`;
    if (images[viteImagePath]) {
      return images[viteImagePath].default;
    } else {
      console.warn(`[SubmitSummaryPage] Imagem do mock não encontrada! Procurando por: "${viteImagePath}". Caminho original: "${coverPath}"`);
      return 'https://via.placeholder.com/150x220.png?text=Capa+N%C3%A3o+Encontrada';
    }
  };

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
    
    // Se estiver atualizando um resumo para um livro existente (do mockdata ou já cadastrado na API)
    if (isUpdating) {
        // Envia o slug do livro existente para que o backend o identifique
        if (prefilledBook.slug) {
            formData.append('slug', prefilledBook.slug);
        }
        // Se a capa é do mock, envia APENAS o nome do arquivo para o backend
        // O backend usará isso para preencher 'cover_url' na tabela 'books'
        if (prefilledBook.cover_url && prefilledBook.cover_url.includes('/assets/')) {
             const imageName = prefilledBook.cover_url.split('/').pop();
             formData.append('coverUrlMock', imageName); 
        } else if (prefilledBook.cover_url) {
            // Se já for uma URL completa (upload anterior), o backend já deve ter a info.
            // Não precisamos reenviá-la a menos que haja uma nova imagem de upload.
        }

        // Se o usuário selecionou uma NOVA imagem de capa (mesmo para um livro existente)
        if (coverImage) {
            formData.append("coverImage", coverImage);
        }
    } else { // Se for um livro completamente novo (não do mock)
        if (coverImage) {
            formData.append("coverImage", coverImage);
        } else {
            setError("Para um novo livro, a imagem da capa é obrigatória.");
            setIsSubmitting(false);
            return;
        }
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
        setMessage("Resumo enviado para avaliação com sucesso!");
        // Redireciona para a página de "Meus Resumos" para ver o novo envio.
        navigate("/meus-resumos"); 
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Erro desconhecido ao enviar o resumo. Verifique o console para mais detalhes.";
      setError(errorMessage);
      console.error("Erro no envio do resumo:", err.response || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setCoverImage(e.target.files[0]);
    }
  };

  // Se o usuário não está logado, exibe uma mensagem e links de autenticação.
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

  // Renderiza o formulário de envio/atualização de resumo
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
          {/* Campos de livro - 'readOnly' se já estiver pré-preenchido */}
          <input type="text" placeholder="Nome do Livro" value={title} onChange={(e) => setTitle(e.target.value)} required readOnly={isUpdating} />
          <input type="text" placeholder="Autor do Livro" value={author} onChange={(e) => setAuthor(e.target.value)} required readOnly={isUpdating} />
          <input type="text" placeholder="Categoria" value={category} onChange={(e) => setCategory(e.target.value)} required readOnly={isUpdating} />
          
          {/* Campo de conteúdo do resumo */}
          <textarea placeholder="Escreva seu resumo aqui..." value={content} onChange={(e) => setContent(e.target.value)} rows="8" required />
          
          {/* Campo de upload de capa - condicional */}
          {isUpdating ? (
            <div className="input-group">
              <label>Capa do Livro:</label>
              <div className="file-upload-wrapper static-preview">
                {resolvedCoverUrl ? (
                  <img src={resolvedCoverUrl} alt={`Capa de ${title}`} className="existing-cover-preview" />
                ) : (
                  <p style={{ fontStyle: "italic" }}>Capa não disponível.</p>
                )}
                {/* Permite alterar a capa mesmo para livros existentes */}
                <label htmlFor="coverImage" className="btn-change-cover-file">Alterar Capa</label>
                <input type="file" id="coverImage" name="coverImage" accept="image/jpeg, image/png" onChange={handleFileChange} />
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
          
          {/* Botão de envio e feedback */}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar para Avaliação"}
          </button>
          {message && <p className="feedback-message success">{message}</p>}
          {error && <p className="feedback-message error">{error}</p>}
        </form>
      </div>

      {/* Seção "Meus Envios" */}
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
                {/* Exibe o status do resumo */}
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
