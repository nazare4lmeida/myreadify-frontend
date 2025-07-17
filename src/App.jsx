// Em src/App.jsx
import { Routes, Route } from 'react-router-dom';

// Componentes
import Header from './components/Header';
import Footer from './components/Footer'; // 1. Importe o Footer

// Páginas
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';
import UploadPage from './pages/UploadPage';
import MySummariesPage from './pages/MySummariesPage';
import AboutPage from './pages/AboutPage'; // 2. Importe a página Sobre
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <>
    <AuthProvider>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/sobre" element={<AboutPage />} /> {/* 3. Adicione a nova rota */}
          <Route path="/livro/:id" element={<BookDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/enviar-resumo" element={<UploadPage />} />
          <Route path="/meus-resumos" element={<MySummariesPage />} />
        </Routes>
      </div>
      <Footer /> {/* 4. Adicione o Footer aqui */}
      </AuthProvider>
    </>
  );
}

export default App;