// src/pages/CategoriesPage.jsx

// ALTERAÇÃO 1: Adicionar 'useEffect' e 'api'
import { useState, useEffect } from 'react';
import api from '../services/api';

// SEU CÓDIGO ORIGINAL (continua aqui, intacto)
import { mockLivros } from '../data/mockData';
import BookCard from '../components/BookCard';
import './CategoriesPage.css';

const CategoriesPage = () => {
  // ALTERAÇÃO 2: Criamos um estado para guardar a lista combinada de livros.
  // Ele começa com os seus mockLivros, para que a página não fique vazia.
  const [todosOsLivros, setTodosOsLivros] = useState(mockLivros);
  
  // SEU CÓDIGO ORIGINAL (continua aqui, intacto)
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');

  // ALTERAÇÃO 3: Adicionamos este bloco para buscar os livros da API e JUNTÁ-LOS com os existentes.
  useEffect(() => {
    api.get('/books')
      .then(response => {
        // Pega os livros da API
        const livrosDaApi = response.data;
        
        // Combina os livros da API com os seus mockLivros
        // O 'Set' aqui ajuda a evitar duplicatas caso algum livro exista nos dois lugares
        const livrosCombinados = [...mockLivros, ...livrosDaApi];
        const livrosUnicos = Array.from(new Set(livrosCombinados.map(l => l.id))).map(id => {
            return livrosCombinados.find(l => l.id === id);
        });

        // Atualiza o estado com a lista completa
        setTodosOsLivros(livrosUnicos);
      })
      .catch(err => {
        console.error("Erro ao buscar livros da API:", err);
        // Se a API falhar, o site continua funcionando com os mockLivros.
      });
  }, []);

  // AGORA, TODO O RESTO DO SEU CÓDIGO USA A NOVA LISTA COMBINADA 'todosOsLivros'
  const todasCategorias = ['Todos', ...new Set(todosOsLivros.map(livro => livro.category))];

  const livrosFiltrados = categoriaSelecionada === 'Todos'
    ? todosOsLivros
    : todosOsLivros.filter(livro => livro.category === categoriaSelecionada);

  // SEU JSX ORIGINAL E LINDO (com a pequena adaptação para a capa)
  return (
    <div>
      <div className="category-header">
        <h2>Navegue por Categoria</h2>
        <div className="category-filters">
          {todasCategorias.map(categoria => (
            <button
              key={categoria}
              className={categoria === categoriaSelecionada ? 'active' : ''}
              onClick={() => setCategoriaSelecionada(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>
      <div className="book-list">
        {livrosFiltrados.map(livro => (
          // O 'cover_url' vem da API, o 'coverUrl' vem do mock. Este código lida com ambos.
          <BookCard key={livro.id} livro={{ ...livro, coverUrl: livro.cover_url || livro.coverUrl }} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;