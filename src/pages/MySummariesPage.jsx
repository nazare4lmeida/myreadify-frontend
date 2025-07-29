// src/pages/MySummariesPage.jsx (VERSÃO FINAL COMPLETA E CORRIGIDA)

import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import "./MySummariesPage.css";

// Importação dinâmica de imagens para o Vite.
// Isso é necessário para que o Vite processe corretamente as referências a imagens locais.
const images = import.meta.glob('../assets/*.jpg', { eager: true });

const MySummariesPage = () => {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { signed } = useAuth();

  const fetchMySummaries = useCallback(async () => {
    setLoading(true);
    try {
      // Faz a requisição para o endpoint do backend que retorna os resumos do usuário logado.
      const response = await api.get("/my-summaries");
      setSummaries(response.data);
    } catch (err) {
      setError(
        "Não foi possível carregar seus envios. Tente recarregar a página."
      );
      console.error(err); // Loga o erro detalhado para depuração.
    } finally {
      setLoading(false);
    }
  }, []); // useCallback com dependência vazia para memoizar a função.

  useEffect(() => {
    // Busca os resumos apenas se o usuário estiver logado.
    if (signed) {
      fetchMySummaries();
    } else {
      setLoading(false); // Se não estiver logado, para o carregamento.
    }
  }, [signed, fetchMySummaries]); // Dependências: `signed` e `fetchMySummaries` (função memoizada).

  // Função para resolver a URL da capa de forma inteligente.
  // Ela lida tanto com caminhos locais (mockdata) quanto com URLs completas (uploads da API).
  const resolveCoverUrl = (coverPath) => {
    // 1. Se não houver caminho, retorna um placeholder genérico.
    if (!coverPath) {
      return 'https://via.placeholder.com/150x220.png?text=Sem+Capa';
    }
    
    // 2. Se o caminho já for uma URL completa (ex: de um upload no Render/Supabase Storage),
    // retorna-a diretamente. O backend agora garante que 'cover_url' é a URL completa ou o caminho relativo do mock.
    if (coverPath.startsWith('http')) {
      return coverPath;
    }

    // 3. Se for um caminho relativo (como os do mockData, ex: 'lordoftherings.jpg' ou '/src/assets/1984.jpg'),
    // tenta resolver usando as imagens importadas pelo Vite.
    // Extrai apenas o nome do arquivo para formar a chave de importação.
    const imageName = coverPath.split('/').pop(); // Pega o nome do arquivo, ex: "lordoftherings.jpg"
    const viteImagePath = `../assets/${imageName}`; // Monta a chave que o Vite espera: "../assets/lordoftherings.jpg"

    // 4. Verifica se a imagem foi encontrada no objeto de importação do Vite.
    if (images[viteImagePath]) {
      // Se encontrou, retorna a URL processada pelo Vite.
      return images[viteImagePath].default;
    } else {
      // Se não encontrou, avisa no console qual chave estava procurando.
      // Isso nos ajuda a depurar se o caminho no mockData estiver diferente.
      console.error(`[MySummariesPage] Imagem do mock não encontrada! Procurando por: "${viteImagePath}". Caminho original: "${coverPath}"`);
      return 'https://via.placeholder.com/150x220.png?text=Capa+N%C3%A3o+Encontrada'; // Fallback se não encontrar.
    }
  };

  if (loading) {
    return (
      <div className="my-summaries-page container">
        <h2>Meus Resumos Enviados</h2>
        <p>Carregando seus envios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-summaries-page container">
        <h2>Meus Resumos Enviados</h2>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="my-summaries-page container">
      <h2>Meus Resumos Enviados</h2>

      {summaries.length > 0 ? (
        <ul className="summaries-list">
          {summaries.map((summary) => (
            <li key={summary.id} className="summary-item">
              <Link
                to={summary.slug ? `/livro/${summary.slug}` : '#'} // Navega para a página do livro, se houver slug.
                className="summary-link-wrapper"
              >
                <img
                  src={resolveCoverUrl(summary.cover_url)} // Usa a função de resolução da URL da capa.
                  alt={`Capa do livro ${summary.title}`}
                  className="summary-cover-image"
                />
                <div className="summary-info">
                  <strong>{summary.title}</strong>
                  <span>por {summary.author}</span>
                </div>
                {/* Garante que summary.status é uma string antes de chamar toLowerCase() */}
                {typeof summary.status === "string" && (
                  <span className={`status status-${summary.status.toLowerCase()}`}>
                    {summary.status === "PENDING" ? "Pendente" : summary.status}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Você ainda não enviou nenhum resumo.</p>
      )}
    </div>
  );
};

export default MySummariesPage;
