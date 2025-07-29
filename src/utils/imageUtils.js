// src/utils/imageUtils.js

// Importa explicitamente todas as imagens locais do mockData.
// Isso garante que o Vite as inclua no bundle e que possamos referenciá-las.
// O caminho deve ser o caminho real do arquivo dentro de src/assets/
import lordOfTheRingsCover from '../assets/lordoftherings.jpg';
import orwell1984Cover from '../assets/1984.jpg';
import toKillAMockingbirdCover from '../assets/tosol.jpg';
import prideAndPrejudiceCover from '../assets/orgulhoepreconceito.jpg';
import dunaCover from '../assets/duna.jpg';
import oneHundredYearsCover from '../assets/cemanos.jpg';
import gameOfThronesCover from '../assets/tronos.jpg';
import littlePrinceCover from '../assets/pequenoprincipe.jpg';
import homemESeusSimbolosCover from '../assets/homemeseussimbolos.jpg';
import asDoresDoMundoCover from '../assets/asdoresdomundo.jpg';
import aObscenaSenhoraDCover from '../assets/aobscenasenhorad.jpg';
import aHoraDaEstrelaCover from '../assets/ahoradaestrela.jpg';
import delicadoAbismoCover from '../assets/delicadoabismo.jpg';
import quartoDeDespejoCover from '../assets/quartodedespejo.jpg';
import diarioDeAnneFrankCover from '../assets/diariodeannefrank.jpg';

// Mapeia os caminhos relativos completos (como salvos no mockData.js e no seeder)
// para as URLs processadas pelo Vite.
// As chaves do mapa devem ser exatamente como o 'cover_url' é armazenado no mockData e no DB (para mockbooks).
const localImagesMap = {
  '/src/assets/lordoftherings.jpg': lordOfTheRingsCover,
  '/src/assets/1984.jpg': orwell1984Cover,
  '/src/assets/tosol.jpg': toKillAMockingbirdCover,
  '/src/assets/orgulhoepreconceito.jpg': prideAndPrejudiceCover,
  '/src/assets/duna.jpg': dunaCover,
  '/src/assets/cemanos.jpg': oneHundredYearsCover,
  '/src/assets/tronos.jpg': gameOfThronesCover,
  '/src/assets/pequenoprincipe.jpg': littlePrinceCover,
  '/src/assets/homemeseussimbolos.jpg': homemESeusSimbolosCover,
  '/src/assets/asdoresdomundo.jpg': asDoresDoMundoCover,
  '/src/assets/aobscenasenhorad.jpg': aObscenaSenhoraDCover,
  '/src/assets/ahoradaestrela.jpg': aHoraDaEstrelaCover,
  '/src/assets/delicadoabismo.jpg': delicadoAbismoCover,
  '/src/assets/quartodedespejo.jpg': quartoDeDespejoCover,
  '/src/assets/diariodeannefrank.jpg': diarioDeAnneFrankCover,
};

/**
 * Retorna a URL correta para a capa de um livro.
 * Esta função é a ÚNICA responsável por resolver caminhos de imagem no frontend.
 * @param {object} book - O objeto do livro, que pode ter 'full_cover_url' (URL completa do backend)
 *   ou 'cover_url' (caminho relativo do mockdata ou nome do arquivo de upload).
 * @returns {string} A URL da imagem pronta para exibição ou um placeholder.
 */
export const getImageUrl = (book) => {
  // Se o objeto book não existe ou não tem informações de capa, retorna placeholder.
  if (!book || (!book.full_cover_url && !book.cover_url)) {
    return 'https://via.placeholder.com/200x300.png?text=Sem+Capa';
  }

  let imageUrlCandidate = null;

  // Prioriza o campo 'cover_url' do objeto book, pois o backend já o preenche
  // com a URL final (seja do full_cover_url ou do caminho relativo do mock).
  if (book.cover_url) {
    imageUrlCandidate = book.cover_url;
  } 
  // Se 'cover_url' não estiver presente, tenta 'full_cover_url' como fallback.
  // Isso é para garantir compatibilidade caso o backend mude a forma de retornar.
  else if (book.full_cover_url) {
    imageUrlCandidate = book.full_cover_url;
  }

  // Se temos um candidato a URL, vamos tentar resolvê-lo.
  if (imageUrlCandidate) {
    // Se já é uma URL HTTP completa (ex: de um upload no Render/Supabase Storage), usa diretamente.
    if (imageUrlCandidate.startsWith('http://') || imageUrlCandidate.startsWith('https://')) {
      return imageUrlCandidate;
    } 
    // Se é um caminho relativo (do mockdata, ex: "/src/assets/nome.jpg")
    else if (imageUrlCandidate.startsWith('/src/assets/')) {
      // Tenta encontrar a URL processada pelo Vite no nosso mapa de imagens locais.
      if (localImagesMap[imageUrlCandidate]) {
        return localImagesMap[imageUrlCandidate];
      } else {
        console.warn(`[getImageUrl] Asset local não encontrado no mapa para: ${imageUrlCandidate}`);
      }
    } 
    // Se é apenas o nome do arquivo (para uploads que o backend não transformou em full_cover_url)
    // ou um caminho relativo que não começa com /src/assets/
    else {
      // Assume que é um nome de arquivo de upload e constrói a URL completa do servidor de arquivos.
      const backendBaseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
      return `${backendBaseUrl}/files/${imageUrlCandidate}`;
    }
  }

  // Fallback final: Se nada acima funcionou, retorna um placeholder de "Capa Não Encontrada".
  console.warn(`[getImageUrl] Não foi possível resolver a imagem para o objeto:`, book);
  return 'https://via.placeholder.com/200x300.png?text=Capa+N%C3%A3o+Encontrada';
};
