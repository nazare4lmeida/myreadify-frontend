// src/pages/CategoriesPage.jsx (VERSÃO FINAL COM CORREÇÃO)

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import mockLivros from '../data/mockData';
import BookCard from '../components/BookCard';
import './CategoriesPage.css';

// Importação dinâmica de imagens para o Vite.
// Isso é necessário para que o Vite processe corretamente as referências a imagens locais.
const images = import.meta.glob('../assets/*.jpg', { eager: true });

const CategoriesPage = () => {
  // Estado para armazenar todos os livros (mock + API)
  const [allBooks, setAllBooks] = useState([]);
  // Estado para a categoria selecionada (padrão 'Todos')
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Função para resolver a URL da capa de forma inteligente.
  // Ela lida tanto com caminhos locais (mockdata) quanto com URLs completas (uploads da API).
  const resolveCoverUrl = (coverPath) => {
    // Se não houver caminho, retorna um placeholder genérico.
    if (!coverPath) {
      return 'https://via.placeholder.com/200x300.png?text=Sem+Capa';
    }
    // Se o caminho já for uma URL completa (ex: de um upload no Render/Supabase Storage),
    // retorna-a diretamente. O backend agora garante que 'cover_url' é a URL completa ou o caminho relativo do mock.
    if (coverPath.startsWith('http')) {
      return coverPath;
    }
    
    // Se for um caminho relativo (como os do mockData, ex: 'lordoftherings.jpg' ou '/src/assets/1984.jpg'),
    // tenta resolver usando as imagens importadas pelo Vite.
    // Extrai apenas o nome do arquivo para formar a chave de importação, se necessário.
    const imageName = coverPath.split('/').pop();
    const viteImagePath = `../assets/${imageName}`;
    
    // Verifica se a imagem foi encontrada no objeto de importação do Vite.
    if (images[viteImagePath]) {
      return images[viteImagePath].default; // Retorna a URL final da imagem local processada pelo Vite.
    } else {
      console.warn(`[CategoriesPage] Imagem do mock não encontrada! Procurando por: "${viteImagePath}". Caminho original: "${coverPath}"`);
      return 'https://via.placeholder.com/200x300.png?text=Capa+N%C3%A3o+Encontrada'; // Fallback se não encontrar.
    }
  };

  useEffect(() => {
    // Busca os livros da API
    api.get('/books')
      .then(response => {
        // Verifica se a resposta da API é válida
        if (!response.data || !Array.isArray(response.data)) {
          console.error("Resposta da API inválida para /books.");
          // Em caso de erro, usa apenas os livros do mockdata
          setAllBooks(mockLivros.map(book => ({ ...book, cover_url: resolveCoverUrl(book.cover_url) })));
          return;
        }

        const apiBooks = response.data;

        // Cria mapas para acesso rápido por slug
        const apiBooksMap = new Map(apiBooks.map(book => [book.slug, book]));
        const mockBooksMap = new Map(mockLivros.map(book => [book.slug, book]));

        // Obtém todos os slugs únicos de ambas as fontes
        const allSlugs = new Set([...apiBooksMap.keys(), ...mockBooksMap.keys()]);
        
        // Constrói a lista final de livros, mesclando dados ou usando apenas uma fonte
        const finalBookList = Array.from(allSlugs)
          .map(slug => {
            const apiVersion = apiBooksMap.get(slug);
            const mockVersion = mockBooksMap.get(slug);

            if (apiVersion) {
              // Se o livro existe na API, usa os dados da API.
              // A cover_url da API já deve vir como full_cover_url ou um caminho local processável.
              return {
                ...apiVersion,
                // Garantimos que a cover_url é resolvida para exibição no frontend.
                cover_url: resolveCoverUrl(apiVersion.cover_url),
                // isPlaceholder indica se o livro da API tem um resumo.
                isPlaceholder: !apiVersion.summary, 
              };
            } else if (mockVersion) {
              // Se o livro existe apenas no mockdata, usa os dados do mock.
              return {
                ...mockVersion,
                // A cover_url do mockdata precisa ser resolvida.
                cover_url: resolveCoverUrl(mockVersion.cover_url),
                isPlaceholder: true, // Livros do mockdata são placeholders até terem resumo.
              };
            }
            return null; // Caso improvável de um slug sem dados em nenhuma fonte.
          })
          .filter(Boolean) // Remove quaisquer entradas nulas
          .sort((a, b) => a.title.localeCompare(b.title)); // Ordena por título

        setAllBooks(finalBookList);
      })
      .catch(err => {
        console.error("Erro ao buscar livros da API em CategoriesPage:", err);
        // Em caso de erro na API, faz fallback para os livros mockados
        setAllBooks(mockLivros.map(book => ({ ...book, cover_url: resolveCoverUrl(book.cover_url) })));
      });
  }, []); // O array de dependências vazio garante que o useEffect rode apenas uma vez na montagem do componente.

  // Extrai todas as categorias únicas da lista de livros para os filtros
  const allCategories = ['Todos', ...new Set(allBooks.map(book => book.category).filter(Boolean))];
  
  // Filtra os livros com base na categoria selecionada
  const filteredBooks = selectedCategory === 'Todos'
    ? allBooks
    : allBooks.filter(book => book.category === selectedCategory);

  return (
    <div>
      <div className="category-header">
        <h2>Navegue por Categoria</h2>
        <div className="category-filters">
          {allCategories.map(category => (
            <button 
              key={category} 
              className={category === selectedCategory ? 'active' : ''} 
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="book-list">
        {filteredBooks.length > 0 ? (
          filteredBooks.map(livro => (
            // Passa o objeto livro completo, incluindo a cover_url já resolvida
            <BookCard key={livro.slug || livro.id} livro={livro} />
          ))
        ) : (
          <p className="empty-message">Nenhum livro encontrado para esta categoria.</p>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
