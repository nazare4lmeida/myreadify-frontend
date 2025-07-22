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
        if (!response.data || !Array.isArray(response.data.books)) {
          console.error("Resposta da API inválida.");
          return;
        }
        
        const apiBooks = response.data.books;

        // --- LÓGICA DE COMBINAÇÃO CORRIGIDA E FINAL ---

        // 1. Cria um mapa dos livros da API para busca rápida.
        const apiBooksMap = new Map(apiBooks.map(book => [book.slug, book]));
        // 2. Cria um mapa dos livros do MOCK para busca rápida.
        const mockBooksMap = new Map(mockLivros.map(book => [book.slug, book]));

        // 3. Pega todos os slugs únicos de ambas as fontes.
        const allSlugs = new Set([...apiBooksMap.keys(), ...mockBooksMap.keys()]);

        // 4. Constrói a lista final a partir dos slugs únicos.
        const finalBookList = Array.from(allSlugs).map(slug => {
          const apiVersion = apiBooksMap.get(slug);
          const mockVersion = mockBooksMap.get(slug);

          if (apiVersion && mockVersion) {
            // Se o livro existe nos dois lugares: funde os dados.
            // A 'coverUrl' do mock tem prioridade.
            return {
              ...mockVersion,
              ...apiVersion,
              isPlaceholder: !apiVersion.summary,
            };
          }
          if (apiVersion) {
            // Se o livro só existe na API (criado do zero): retorna a versão da API.
            // O BookCard saberá como construir a URL da capa a partir do 'cover_url'.
            return apiVersion;
          }
          // Se o livro só existe no mock: retorna a versão do mock.
          return mockVersion;
        });

        setAllBooks(finalBookList);
      })
      .catch(err => {
        console.error("Erro ao buscar livros da API:", err);
        setAllBooks(mockLivros);
      });
  }, []);

  // O resto do seu componente permanece exatamente igual.
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
        {/* Agora, o BookCard receberá o objeto correto, com a capa sempre presente. */}
        {filteredBooks.map(livro => (
          <BookCard key={livro.slug} livro={livro} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;