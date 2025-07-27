import React, { useState, useEffect } from 'react';
import api from '../services/api';
import mockLivros from '../data/mockData';
import BookCard from '../components/BookCard';
import './CategoriesPage.css';

// ADICIONADO 1/3: Importa as imagens para que o Vite as reconheça.
const images = import.meta.glob('../assets/*.jpg', { eager: true });

const CategoriesPage = () => {
  const [allBooks, setAllBooks] = useState(mockLivros);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // ADICIONADO 2/3: A mesma função helper para resolver o caminho da imagem.
  const resolveCoverUrl = (coverPath) => {
    if (!coverPath) return '';
    const imageName = coverPath.split('/').pop();
    const imagePath = `../assets/${imageName}`;
    return images[imagePath]?.default || '';
  };

  useEffect(() => {
    api.get('/books')
      .then(response => {
        if (!response.data || !Array.isArray(response.data)) {
          console.error("Resposta da API inválida.");
          return;
        }

        const apiBooks = response.data;
        const apiBooksMap = new Map(apiBooks.map(book => [book.slug, book]));
        const mockBooksMap = new Map(mockLivros.map(book => [book.slug, book]));
        const allSlugs = new Set([...apiBooksMap.keys(), ...mockBooksMap.keys()]);
        
        const finalBookList = Array.from(allSlugs).map(slug => {
          const apiVersion = apiBooksMap.get(slug);
          const mockVersion = mockBooksMap.get(slug);

          if (apiVersion && mockVersion) {
            return {
              ...mockVersion,
              ...apiVersion,
              isPlaceholder: !apiVersion.content,
            };
          }
          if (apiVersion) {
            return {
              ...apiVersion,
              isPlaceholder: !apiVersion.content,
            };
          }
          return {
            ...mockVersion,
            isPlaceholder: true,
          };
        });

        setAllBooks(finalBookList);
      })
      .catch(err => {
        console.error("Erro ao buscar livros da API:", err);
        setAllBooks(mockLivros);
      });
  }, []);

  const allCategories = ['Todos', ...new Set(allBooks.map(book => book.category).filter(Boolean))];
  
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
        {filteredBooks.map(livro => (
          // ADICIONADO 3/3: Processa a URL da capa ANTES de passar para o BookCard.
          <BookCard 
            key={livro.slug} 
            livro={{ ...livro, cover_url: resolveCoverUrl(livro.cover_url) }} 
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;