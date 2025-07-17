// Em src/pages/HomePage.jsx
import { mockLivros } from '../data/mockData'; // Importe os dados
import BookCard from '../components/BookCard';

const HomePage = () => {
  // Agora usamos a lista de livros importada. Não precisamos mais do useState aqui por enquanto.
  const livros = mockLivros;

  return (
    <main>
      <h2>Destaques da Nossa Biblioteca</h2>
      <div className="book-list">
        {livros.map(livro => (
          <BookCard key={livro.id} livro={livro} />
        ))}
      </div>
    </main>
  );
};

export default HomePage;