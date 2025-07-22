// src/pages/ContactPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import './ContactPage.css'; // Criaremos este arquivo a seguir

const ContactPage = () => {
  const { user, signed } = useAuth();

  // Se o usuário está logado, usamos os dados dele. Senão, campos vazios.
  const [formData, setFormData] = useState({
    name: signed ? user.name : '',
    email: signed ? user.email : '',
    subject: '',
    message: '',
  });

  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback({ message: '', type: '' });

    try {
      await api.post('/contact', formData); 
      
      setFeedback({ 
        message: 'Sua mensagem foi enviada com sucesso! Agradecemos o contato. Em breve vamos responder.', 
        type: 'success' 
      });
      
      // --- AQUI ESTÁ A CORREÇÃO FINAL E MAIS SIMPLES ---
      // Resetamos o formulário para um estado completamente em branco.
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Ocorreu um erro interno ao processar sua solicitação.';
      setFeedback({ message: errorMessage, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="contact-page-container">
      <div className="contact-form-wrapper">
        <h2>Fale Conosco</h2>
        <p className="contact-subtitle">
          Tem alguma dúvida, sugestão ou reclamação? Preencha o formulário abaixo e entraremos em contato.
        </p>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Seu Nome:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={signed} // Desabilita o campo se o usuário estiver logado
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Seu Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={signed}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Assunto:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Mensagem:</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          {feedback.message && (
            <div className={`feedback-message ${feedback.type}`}>
              {feedback.message}
            </div>
          )}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;