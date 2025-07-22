import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>Sobre o MyReadify</h1>
        <p className="subtitle">Conectando leitores, uma indicação de cada vez.</p>
      </div>
      <div className="about-content">
        <p>
          O MyReadify nasceu de uma ideia simples: criar um espaço acolhedor e funcional para todos que amam livros. Acreditamos que cada livro é uma porta para um novo universo, e encontrar a porta certa pode ser uma jornada maravilhosa. Nosso objetivo é facilitar essa descoberta.
        </p>
        <p>
          Esta é uma plataforma de indicação de livros onde você pode não apenas explorar uma biblioteca cuidadosamente selecionada, mas também interagir com ela. Aqui, você pode:
        </p>
        <ul>
          <li>Adicionar, atualizar e remover livros e resumos da sua estante pessoal.</li>
          <li>Pesquisar obras pelo seu autor favorito.</li>
          <li>Marcar aqueles livros que tocaram seu coração como favoritos.</li>
          <li>Fazer avaliações e comentários sobre livros que você leu.</li>
          <li>Descobrir novos autores e obras recomendadas pela comunidade.</li>
          <li>Enviar resumos e propostas de resumos para livros que você gostaria de ver na plataforma.</li>
        </ul>
        <p>
          Este projeto está em constante evolução, impulsionado pela paixão pela leitura e pela tecnologia. Queremos que o MyReadify seja a sua estante digital de confiança, um lugar para onde você sempre pode voltar em busca de inspiração.
        </p>
        <p>
          Explore, descubra e, acima de tudo, continue lendo!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;