// Em src/App.jsx

import { Routes, Route } from 'react-router-dom';

// Componentes
import Header from './components/Header';
import Footer from './components/Footer';

// Páginas
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import BookDetailPage from './pages/BookDetailPage';
import LoginPage from './pages/LoginPage';
import MySummariesPage from './pages/MySummariesPage';
import AboutPage from './pages/AboutPage';
import MyReviewsPage from './pages/MyReviewsPage';
import RegisterPage from './pages/RegisterPage';
import SubmitSummaryPage from './pages/SubmitSummaryPage';
import AdminApprovalPage from './pages/AdminApprovalPage';
import SubmitPromptPage from './pages/SubmitPromptPage';

// Contexto e Rotas Protegidas
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
            <Route path="/sobre" element={<AboutPage />} />
            <Route path="/livro/:slug" element={<BookDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/meus-resumos" element={<MySummariesPage />} />
            <Route path="/minhas-avaliacoes" element={<MyReviewsPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/enviar-resumo" element={<SubmitSummaryPage />} />
            
            {/* --- MUDANÇA: A rota agora espera um ':slug' em vez de ':id' --- */}
            <Route path="/proposta-resumo/:slug" element={<SubmitPromptPage />} />

            <Route 
              path="/admin/aprovacoes" 
              element={
                  <AdminApprovalPage />
              } 
            />
          </Routes>
        </div>
        <Footer />
      </AuthProvider>
    </>
  );
}

export default App;