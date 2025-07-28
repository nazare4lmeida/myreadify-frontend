// src/pages/CategoriesPage.jsx (VERSÃO FINAL COM CORREÇÃO MÍNIMA)

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import mockLivros from '../data/mockData';
import BookCard from '../components/BookCard';
import './CategoriesPage.css';

const images = import.meta.glob('../assets/*.jpg', { eager: true });

const CategoriesPage = () => {
  const [allBooks, setAllBooks] = useState(mockLivros);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // <<< CORREÇÃO PRINCIPAL AQUI >>>
  const resolveCoverUrl = (coverPath) => {
    // Se a URL já é completa (começa com http), retorna ela mesma.
    if (coverPath && coverPath.startsWith('http')) {
      return coverPath;
    }
    // Se não, tenta resolver o caminho local como antes (para o mockData).
    if (!coverPath || coverPath.startsWith('/src/assets')) return coverPath;
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
              cover_url: mockVersion.cover_url,
              isPlaceholder: !apiVersion.summary, // Verificamos o campo 'summary' que vem da API
            };
          }

          if (apiVersion) {
            // A chamada para resolveCoverUrl agora vai funcionar para a URL da API
            return {
              ...apiVersion,
              cover_url: resolveCoverUrl(apiVersion.cover_url),
              isPlaceholder: !apiVersion.summary,
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
            <button key={category} className={category === selectedCategory ? 'active' : ''} onClick={() => setSelectedCategory(category)}>
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="book-list">
        {filteredBooks.map(livro => (
          <BookCard key={livro.slug || livro.id} livro={livro} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;