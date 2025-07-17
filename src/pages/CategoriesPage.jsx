import { useSearchParams } from 'react-router-dom'; // 1. Importar o hook useSearchParams
import { mockLivros } from '../data/mockData';
import BookCard from '../components/BookCard';
import './CategoriesPage.css';

const todasCategorias = ['Todos', ...new Set(mockLivros.map(livro => livro.category))];

const CategoriesPage = () => {
  // 2. Usar o hook. Ele retorna os parâmetros atuais e uma função para atualizá-los.
  const [searchParams, setSearchParams] = useSearchParams();

  // 3. A categoria selecionada agora vem DIRETO da URL. 
  // Se não houver o parâmetro 'category', o padrão é 'Todos'.
  const categoriaSelecionada = searchParams.get('category') || 'Todos';

  // 4. A lógica de filtragem continua a mesma, mas agora usa a variável que vem da URL.
  const livrosFiltrados = categoriaSelecionada === 'Todos'
    ? mockLivros
    : mockLivros.filter(livro => livro.category === categoriaSelecionada);

  // 5. Função que será chamada ao clicar em um botão de filtro.
  const handleFilterClick = (categoria) => {
    if (categoria === 'Todos') {
      // Se for "Todos", removemos o parâmetro da URL.
      setSearchParams({}); 
    } else {
      // Para as outras categorias, definimos o parâmetro na URL.
      setSearchParams({ category: categoria });
    }
  };

  return (
    <div>
      <div className="category-header">
        <h2>Navegue por Categoria</h2>
        <div className="category-filters">
          {todasCategorias.map(categoria => (
            <button
              key={categoria}
              className={categoria === categoriaSelecionada ? 'active' : ''}
              // 6. O clique agora chama nossa nova função que atualiza a URL.
              onClick={() => handleFilterClick(categoria)}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>
      <div className="book-list">
        {livrosFiltrados.map(livro => (
          <BookCard key={livro.id} livro={livro} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;