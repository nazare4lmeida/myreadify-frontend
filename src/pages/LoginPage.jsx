// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 1. Importa nosso hook de autenticação
import './LoginPage.css'; // Criaremos este CSS

const LoginPage = () => {
  // Estados para guardar o que o usuário digita
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  // 2. Pega a função de login do nosso contexto
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o recarregamento da página
    setError(''); // Limpa erros antigos

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      // 3. Chama a função signIn que está no nosso AuthContext
      await signIn({ email, password });
      // 4. Se o login for bem-sucedido, redireciona para a página inicial
      navigate('/');
    } catch (err) {
      // Se o signIn der erro, o AuthContext o lança, e nós o pegamos aqui
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Acesse sua Conta</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
           <div className="input-group">
            <label htmlFor="password">Senha</label>
            <div className="password-wrapper">
            <input
                // 3. O tipo do input agora é dinâmico
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
              />
              {/* 4. O botão que alterna a visibilidade */}
            <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Mostrar/Ocultar senha" // Melhora a acessibilidade
                >
            {showPassword ? (
            // Ícone de Olho Aberto
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                // Ícone de Olho Riscado
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
            </button>
            </div>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button-submit">Entrar</button>
        </form>
        <p className="signup-link">
          Não tem uma conta? <a>Cadastre-se</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
