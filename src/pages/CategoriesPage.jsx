// src/pages/CategoriesPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { mockLivros } from '../data/mockData'; // Seus livros placeholder
import BookCard from '../components/BookCard';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [allBooks, setAllBooks] = useState(mockLivros); // Começa com os placeholders
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    // Busca os livros "reais" que já foram enviados e aprovados
    api.get('/books')
      .then(response => {
        const apiBooks = response.data;
        
        // --- LÓGICA DE COMBINAÇÃO INTELIGENTE ---

        // 1. Cria um "Set" (conjunto) com os slugs de todos os livros que vieram da API.
        // Um Set é super rápido para fazer buscas do tipo "contém ou não contém".
        const apiBookSlugs = new Set(apiBooks.map(book => book.slug));

        // 2. Filtra a sua lista de mockLivros.
        // Mantém apenas os livros do mock cujo slug NÃO EXISTE na lista da API.
        // Isso efetivamente remove os placeholders que já foram "preenchidos".
        const filteredMockBooks = mockLivros.filter(
          mockBook => !apiBookSlugs.has(mockBook.slug)
        );

        // 3. Combina a lista de mocks filtrada com a lista completa de livros da API.
        const finalBookList = [...filteredMockBooks, ...apiBooks];

        // Atualiza o estado da página com a lista final e correta.
        setAllBooks(finalBookList);
      })
      .catch(err => {
        console.error("Erro ao buscar livros da API:", err);
        // Se a API falhar, a página continua funcionando apenas com os mocks.
      });
  }, []); // O array vazio [] garante que isso só rode uma vez, quando a página carrega.

  const allCategories = ['Todos', ...new Set(allBooks.map(book => book.category))];
  
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
          <BookCard key={livro.id} livro={livro} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;