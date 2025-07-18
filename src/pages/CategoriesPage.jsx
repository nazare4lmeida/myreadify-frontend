// src/pages/CategoriesPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { mockLivros } from '../data/mockData';
import BookCard from '../components/BookCard';
import './CategoriesPage.css';

const CategoriesPage = () => {
  const [allBooks, setAllBooks] = useState(mockLivros);
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    api.get('/books')
      .then(response => {
        const apiBooks = response.data;
        // Simplesmente combina os livros do mock com os livros da API
        setAllBooks([...mockLivros, ...apiBooks]);
      })
      .catch(err => {
        console.error("Erro ao buscar livros da API:", err);
      });
  }, []);

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
            <button key={category} className={category === selectedCategory ? 'active' : ''} onClick={() => setSelectedCategory(category)}>
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="book-list">
        {filteredBooks.map(livro => (
          // A lógica aqui continua a mesma
          <BookCard key={livro.id} livro={{ ...livro, coverUrl: livro.cover_url || livro.coverUrl }} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;