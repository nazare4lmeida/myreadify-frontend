import React from 'react';
import { useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './SubmitPromptPage.css';

// Importação dinâmica de imagens para o Vite.
// Isso é necessário para que o Vite processe corretamente as referências a imagens locais.
const images = import.meta.glob('../assets/*.jpg', { eager: true });

const SubmitPromptPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { signed } = useAuth();

  // Redireciona para a página inicial se não houver dados do livro no estado.
  if (!state?.bookData) {
    return <Navigate to="/" />;
  }

  const book = state.bookData; // O objeto do livro vem via `state.bookData` do `BookDetailPage`.

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
    const imageName = coverPath.split('/').pop();
    const viteImagePath = `../assets/${imageName}`;

    // 4. Verifica se a imagem foi encontrada no objeto de importação do Vite.
    if (images[viteImagePath]) {
      // Se encontrou, retorna a URL processada pelo Vite.
      return images[viteImagePath].default;
    } else {
      // Se não encontrou, avisa no console qual chave estava procurando.
      // Isso nos ajuda a depurar se o caminho no mockData estiver diferente.
      console.warn(`[SubmitPromptPage] Imagem do mock não encontrada! Procurando por: "${viteImagePath}". Caminho original: "${coverPath}"`);
      return 'https://via.placeholder.com/200x300.png?text=Capa+N%C3%A3o+Encontrada'; // Fallback se não encontrar.
    }
  };

  const handleNavigate = () => {
    if (signed) {
      // Navega para a página de envio de resumo, passando o objeto 'book' completo no estado.
      // Isso permite que a página de envio preencha todos os campos do livro, incluindo a capa.
      navigate('/enviar-resumo', { state: { book: book } });
    } else {
      navigate('/login'); // Redireciona para o login se o usuário não estiver logado.
    }
  };

  // Resolve a URL da imagem da capa para exibição usando a função inteligente.
  const displayCoverImage = resolveCoverUrl(book.cover_url);

  return (
    <div className="submit-prompt-page container">
      <div className="prompt-card">
        <img
          src={displayCoverImage} // Usa a URL da capa já resolvida.
          alt={`Capa de ${book.title}`}
          loading="lazy"
          className="prompt-cover"
        />
        <div className="prompt-info">
          <h1>{book.title}</h1>
          <p className="prompt-message">Este livro ainda não possui um resumo em nossa biblioteca.</p>
          <h2>Gostaria de ser o primeiro a enviar?</h2>
          <button onClick={handleNavigate} className="btn-prompt">
            {signed ? 'Sim, quero enviar um resumo!' : 'Faça Login para Enviar'}
          </button>
          <Link to="/categorias" className="back-link">Voltar para a biblioteca</Link>
        </div>
      </div>
    </div>
  );
};

export default SubmitPromptPage;
