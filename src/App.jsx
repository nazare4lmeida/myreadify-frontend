// Em src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import LoginPage from './pages/LoginPage';
import UploadPage from './pages/UploadPage';
import MyDownloadsPage from './pages/MyDownloadsPage';
import BookDetailPage from './pages/BookDetailPage';

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          {/* 2. Adicione a rota para os detalhes do livro. O :id é um parâmetro dinâmico. */}
          <Route path="/livro/:id" element={<BookDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/enviar-livro" element={<UploadPage />} />
          <Route path="/meus-downloads" element={<MyDownloadsPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;