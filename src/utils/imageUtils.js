// src/utils/imageUtils.js

// Importa explicitamente todas as imagens locais do mockData.
// Isso garante que o Vite as inclua no bundle e que possamos referenciá-las.
import lordOfTheRingsCover from "../assets/lordoftherings.jpg";
import orwell1984Cover from "../assets/1984.jpg";
import toKillAMockingbirdCover from "../assets/tosol.jpg";
import prideAndPrejudiceCover from "../assets/orgulhoepreconceito.jpg";
import dunaCover from "../assets/duna.jpg";
import oneHundredYearsCover from "../assets/cemanos.jpg";
import gameOfThronesCover from "../assets/tronos.jpg";
import littlePrinceCover from "../assets/pequenoprincipe.jpg";
import homemESeusSimbolosCover from "../assets/homemeseussimbolos.jpg";
import asDoresDoMundoCover from "../assets/asdoresdomundo.jpg";
import aObscenaSenhoraDCover from "../assets/aobscenasenhorad.jpg";
import aHoraDaEstrelaCover from "../assets/ahoradaestrela.jpg";
import delicadoAbismoCover from "../assets/delicadoabismo.jpg";
import quartoDeDespejoCover from "../assets/quartodedespejo.jpg";
import diarioDeAnneFrankCover from "../assets/diariodeannefrank.jpg";

// Mapeia os caminhos relativos completos (como salvos no mockData.js e no seeder)
// para as URLs processadas pelo Vite.
const localImagesMap = {
  "/src/assets/lordoftherings.jpg": lordOfTheRingsCover,
  "/src/assets/1984.jpg": orwell1984Cover,
  "/src/assets/tosol.jpg": toKillAMockingbirdCover,
  "/src/assets/orgulhoepreconceito.jpg": prideAndPrejudiceCover,
  "/src/assets/duna.jpg": dunaCover,
  "/src/assets/cemanos.jpg": oneHundredYearsCover,
  "/src/assets/tronos.jpg": gameOfThronesCover,
  "/src/assets/pequenoprincipe.jpg": littlePrinceCover,
  "/src/assets/homemeseussimbolos.jpg": homemESeusSimbolosCover,
  "/src/assets/asdoresdomundo.jpg": asDoresDoMundoCover,
  "/src/assets/aobscenasenhorad.jpg": aObscenaSenhoraDCover,
  "/src/assets/ahoradaestrela.jpg": aHoraDaEstrelaCover,
  "/src/assets/delicadoabismo.jpg": delicadoAbismoCover,
  "/src/assets/quartodedespejo.jpg": quartoDeDespejoCover,
  "/src/assets/diariodeannefrank.jpg": diarioDeAnneFrankCover,
};

/**
 * Retorna a URL correta para a capa de um livro.
 * Esta função é a ÚNICA responsável por resolver caminhos de imagem no frontend.
 * @param {object} book - O objeto do livro, que pode ter 'full_cover_url' (da API)
 *   ou 'cover_url' (caminho relativo do mockdata ou nome do arquivo de upload).
 * @returns {string} A URL da imagem pronta para exibição ou um placeholder.
 */
export const getImageUrl = (book) => {
  // Se o objeto book não existe ou não tem informações de capa, retorna placeholder.
  if (!book || (!book.full_cover_url && !book.cover_url)) {
    return "https://via.placeholder.com/200x300.png?text=Sem+Capa";
  }

  let finalUrl = null;

  // Tenta resolver a URL a partir de 'full_cover_url' (campo virtual do backend)
  if (book.full_cover_url) {
    // Se já é uma URL HTTP completa (upload da API), usa diretamente.
    if (book.full_cover_url.startsWith("http")) {
      finalUrl = book.full_cover_url;
    }
    // Se é um caminho relativo (do mockdata, vindo do backend via full_cover_url)
    else if (book.full_cover_url.startsWith("/src/assets")) {
      finalUrl = localImagesMap[book.full_cover_url];
    }
  }

  // Se 'full_cover_url' não resolveu, tenta resolver a partir de 'cover_url' (campo do DB)
  if (!finalUrl && book.cover_url) {
    // Se é um caminho relativo (do mockdata, diretamente do mockLivros)
    if (book.cover_url.startsWith("/src/assets")) {
      finalUrl = localImagesMap[book.cover_url];
    }
    // Se é apenas o nome do arquivo (para uploads que não vieram com full_cover_url por algum motivo)
    else if (!book.cover_url.startsWith("http")) {
      const backendBaseUrl = import.meta.env.VITE_API_URL.replace("/api", "");
      finalUrl = `${backendBaseUrl}/files/${book.cover_url}`;
    }
  }

  // Se 'finalUrl' ainda não foi definida ou é inválida, retorna um placeholder de erro.
  if (!finalUrl) {
    console.warn(
      `[getImageUrl] Não foi possível resolver a imagem para:`,
      book
    );
    return "https://via.placeholder.com/200x300.png?text=Capa+N%C3%A3o+Encontrada";
  }

  return finalUrl;
};
