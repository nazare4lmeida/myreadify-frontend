// src/pages/CategoriesPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import mockLivros from '../data/mockData';
import BookCard from '../components/BookCard';
import './CategoriesPage.css';
import { getImageUrl } from '../utils/imageUtils'; // Importe a nova função utilitária

// REMOVER: A importação dinâmica de imagens do Vite não é mais necessária aqui
// const images = import.meta.glob('../assets/*.jpg', { eager: true });
// REMOVER: A função resolveCoverUrl interna não é mais necessária aqui

const CategoriesPage = () => {
  const [allBooks, setAllBooks] = useState(mockLivros);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
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
              ...mockVersion, // Mantém ID, title, author, category, slug, cover_url (filename) do mock
              ...apiVersion, // Sobrescreve com dados da API (incluindo full_cover_url, se existir)
              isPlaceholder: !apiVersion.summary, // Indica se tem resumo na API
            };
          }

          if (apiVersion) {
            // Se só existe na API, usa a versão da API. A cover_url já virá resolvida (full_cover_url).
            return {
              ...apiVersion,
              isPlaceholder: !apiVersion.summary,
            };
          }

          // Se só existe no mock, usa a versão do mock (cover_url será o filename)
          return {
            ...mockVersion,
            isPlaceholder: true, // Ainda um placeholder se não tiver resumo na API
          };
        });

        setAllBooks(finalBookList);
      })
      .catch(err => {
        console.error("Erro ao buscar livros da API, usando dados locais:", err);
        // Fallback para mocks em caso de erro.
        // Não precisamos mais pré-processar a cover_url aqui,
        // pois o BookCard e getImageUrl já tratam isso no momento da exibição.
        setAllBooks(mockLivros); 
      });
  }, []);

  // Garante que as categorias vazias ou nulas não apareçam
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
          <BookCard key={livro.slug || livro.id} livro={livro} /> 
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
