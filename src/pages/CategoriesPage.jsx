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
        if (!response.data || !Array.isArray(response.data.books)) {
          console.error("Resposta da API inválida.");
          return;
        }
        
        const apiBooks = response.data.books;
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
              isPlaceholder: !apiVersion.summary,
            };
          }
          if (apiVersion) {

            return apiVersion;
          }
          return mockVersion;
        });

        setAllBooks(finalBookList);
      })
      .catch(err => {
        console.error("Erro ao buscar livros da API:", err);
        setAllBooks(mockLivros);
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
          <BookCard key={livro.slug} livro={livro} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;