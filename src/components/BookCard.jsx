import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookCard.css";
import { getImageUrl } from "../utils/imageUtils"; // Importe a nova função utilitária

const BookCard = ({ livro }) => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false); // Usa a função centralizada para obter a URL da imagem. // 'livro' agora deve conter 'full_cover_url' (da API) ou 'cover_url' (do mock).

  const imageUrl = getImageUrl(livro);

  const handleAction = () => {
    // Só navega se o livro tiver um slug definido.
    if (livro.slug) {
      navigate(`/livro/${livro.slug}`);
    } else {
      console.error("Tentativa de navegar para um livro sem slug:", livro);
    }
  };

  return (
    <div className="book-card">
           {" "}
      <div className="book-cover-wrapper" onClick={handleAction}>
               {" "}
        <img
          src={imageUrl}
          alt={`Capa do livro ${livro.title}`}
          loading="lazy"
          width={200}
          height={300}
          className="book-cover"
          style={{ opacity: isLoaded ? 1 : 0 }}
          onLoad={() => setIsLoaded(true)}
        />
                {!isLoaded && <div className="skeleton-loader"></div>}     {" "}
      </div>
           {" "}
      <div className="book-info" onClick={handleAction}>
                <h3>{livro.title}</h3>        <p>{livro.author}</p>     {" "}
      </div>
           {" "}
      <div className="card-actions">
               {" "}
        <button className="btn-summary" onClick={handleAction}>
                    {/* A lógica do texto do botão pode continuar a mesma */}   
                {livro.isPlaceholder ? "Ver Detalhes" : "Ler Resumo"}       {" "}
        </button>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default BookCard;
