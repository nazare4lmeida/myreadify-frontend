// src/utils/imageUtils.js

// Importa todas as imagens locais do mockData
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

// Mapeia os nomes dos arquivos (como vêm do mockData e do seeder do backend) para suas URLs importadas.
// Este objeto atua como um "cache" para as imagens locais.
const localImages = {
  'lordoftherings.jpg': lordOfTheRingsCover,
  '1984.jpg': orwell1984Cover,
  'tosol.jpg': toKillAMockingbirdCover,
  'orgulhoepreconceito.jpg': prideAndPrejudiceCover,
  'duna.jpg': dunaCover,
  'cemanos.jpg': oneHundredYearsCover,
  'tronos.jpg': gameOfThronesCover,
  'pequenoprincipe.jpg': littlePrinceCover,
  'homemeseussimbolos.jpg': homemESeusSimbolosCover,
  'asdoresdomundo.jpg': asDoresDoMundoCover,
  'aobscenasenhorad.jpg': aObscenaSenhoraDCover,
  'ahoradaestrela.jpg': aHoraDaEstrelaCover,
  'delicadoabismo.jpg': delicadoAbismoCover,
  'quartodedespejo.jpg': quartoDeDespejoCover,
  'diariodeannefrank.jpg': diarioDeAnneFrankCover,
};

/**
 * Retorna a URL completa da capa do livro, priorizando a URL da API,
 * ou resolvendo o caminho de um asset local se for um livro do mockData.
 * @param {object} book - O objeto do livro.
 * @param {string} [book.full_cover_url] - A URL completa da capa do livro (do backend API).
 * @param {string} [book.cover_url] - O nome do arquivo da capa (do mockData ou do upload antes de ser uma URL completa).
 * @returns {string} A URL da imagem a ser usada no src de uma tag <img>.
 */
export const getImageUrl = (book) => {
  // Se o objeto book ou suas URLs não existirem, retorna um placeholder genérico.
  if (!book || (!book.cover_url && !book.full_cover_url)) {
    return 'https://via.placeholder.com/200x300.png?text=Sem+Capa';
  }

  // 1. Prioriza 'full_cover_url' se estiver presente (vem da API, já é a URL completa)
  if (book.full_cover_url) {
    return book.full_cover_url;
  }

  // 2. Se 'full_cover_url' não existe, tenta resolver 'cover_url' como um filename local
  const filename = book.cover_url; // Espera que cover_url seja apenas o nome do arquivo (ex: 'lordoftherings.jpg')
  if (localImages[filename]) {
    return localImages[filename];
  }

  // 3. Se 'cover_url' é um caminho relativo (como '/src/assets/...') do mockData antigo,
  // ou um caminho de arquivo de upload que não é uma URL completa e não está no 'localImages',
  // tenta tratar como um caminho direto para o servidor de arquivos (para uploads em dev).
  // Isso cobre o cenário onde cover_url é o nome do arquivo de upload, que a API transforma em /files/nome_do_arquivo
  // Mas para o frontend, se não tem full_cover_url, e não é um mock importado, pode ser um upload.
  // IMPORTANTE: Isso pressupõe que o APP_URL do backend esteja acessível.
  if (filename && !filename.startsWith('http')) {
     const backendBaseUrl = import.meta.env.VITE_API_URL.replace('/api', '');
     // Assume que arquivos de upload são servidos em /files/
     return `${backendBaseUrl}/files/${filename}`;
  }


  // 4. Se nada acima funcionou, retorna um placeholder de "Capa Não Encontrada".
  console.warn(`[getImageUrl] Não foi possível resolver a imagem para:`, book);
  return 'https://via.placeholder.com/200x300.png?text=Capa+N%C3%A3o+Encontrada';
};
