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
import MySummariesPage from './pages/MySummariesPage';
import AboutPage from './pages/AboutPage'; // 2. Importe a página Sobre
import { AuthProvider } from './contexts/AuthContext';
import MyReviewsPage from './pages/MyReviewsPage';
import RegisterPage from './pages/RegisterPage';
import SubmitSummaryPage from './pages/SubmitSummaryPage';
 // 3. Importe a página de envio de resumo
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
          <Route path="/meus-resumos" element={<MySummariesPage />} />
          <Route path="/minhas-avaliacoes" element={<MyReviewsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/enviar-resumo" element={<SubmitSummaryPage />} />
        </Routes>
      </div>
      <Footer /> {/* 4. Adicione o Footer aqui */}
      </AuthProvider>
    </>
  );
}

export default App;