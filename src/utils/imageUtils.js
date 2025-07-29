// src/utils/imageUtils.js

// Importa dinamicamente todas as imagens JPG da pasta assets
// O Vite vai processar isso e retornar um objeto com os caminhos processados
const localImagesRaw = import.meta.glob('../assets/images/covers/*.jpg', { eager: true });

// Mapeia os caminhos brutos para um formato mais fácil de usar:
// { 'lordoftherings.jpg': '/src/assets/images/covers/lordoftherings.jpg' }
const localImages = Object.keys(localImagesRaw).reduce((acc, path) => {
  const filename = path.split('/').pop();
  acc[`/src/assets/images/covers/${filename}`] = localImagesRaw[path].default; // Usa o caminho completo como chave
  return acc;
}, {});

/**
 * Retorna a URL correta para a capa de um livro.
 * Prioriza a `full_cover_url` vinda do backend. Se não houver, tenta resolver
 * o `cover_url` localmente (para mockdata).
 * @param {object} book - O objeto livro com as propriedades cover_url e/ou full_cover_url.
 * @returns {string} A URL da imagem ou um placeholder.
 */
export const getImageUrl = (book) => {
  if (!book) {
    return 'https://via.placeholder.com/200x300.png?text=Sem+Capa';
  }

  // 1. Prioriza full_cover_url (que já vem pronta do backend para uploads ou mock)
  if (book.full_cover_url) {
    return book.full_cover_url;
  }

  // 2. Se não houver full_cover_url, tenta resolver cover_url como um caminho de asset local
  if (book.cover_url && book.cover_url.startsWith('/src/assets')) {
    // Verifica se o caminho do asset local existe no nosso mapa processado pelo Vite
    if (localImages[book.cover_url]) {
      return localImages[book.cover_url];
    } else {
      console.warn(`[getImageUrl] Asset local não encontrado para: ${book.cover_url}`);
    }
  }

  // 3. Fallback: Se nada funcionou, retorna um placeholder genérico
  return 'https://via.placeholder.com/200x300.png?text=Sem+Capa';
};
