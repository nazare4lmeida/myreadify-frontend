// src/data/mockData.js

// REMOVIDO: As importações diretas de imagens não são mais necessárias aqui.
// As imagens serão resolvidas dinamicamente via getImageUrl em imageUtils.js.

const mockLivros = [
  { id: 1000000, title: 'O Senhor dos Anéis', author: 'J.R.R. Tolkien', category: 'Fantasia', cover_url: 'lordoftherings.jpg', isPlaceholder: true, slug: 'o-senhor-dos-aneis' },
  { id: 2000000, title: '1984', author: 'George Orwell', category: 'Ficção Científica', cover_url: '1984.jpg', isPlaceholder: true, slug: '1984' },
  { id: 3000000, title: 'O Sol é para Todos', author: 'Harper Lee', category: 'Clássicos', cover_url: 'tosol.jpg', isPlaceholder: true, slug: 'o-sol-e-para-todos' },
  { id: 4000000, title: 'Orgulho e Preconceito', author: 'Jane Austen', category: 'Romance', cover_url: 'orgulhoepreconceito.jpg', isPlaceholder: true, slug: 'orgulho-e-preconceito' },
  { id: 5000000, title: 'Duna', author: 'Frank Herbert', category: 'Ficção Científica', cover_url: 'duna.jpg', isPlaceholder: true, slug: 'duna' },
  { id: 6000000, title: 'Cem Anos de Solidão', author: 'Gabriel García Márquez', category: 'Clássicos', cover_url: 'cemanos.jpg', isPlaceholder: true, slug: 'cem-anos-de-solidao' },
  { id: 7000000, title: 'A Guerra dos Tronos', author: 'George R. R. Martin', category: 'Fantasia', cover_url: 'tronos.jpg', isPlaceholder: true, slug: 'a-guerra-dos-tronos' },
  { id: 8000000, title: 'O Pequeno Príncipe', author: 'Antoine de Saint-Exupéry', category: 'Clássicos', cover_url: 'pequenoprincipe.jpg', isPlaceholder: true, slug: 'o-pequeno-principe' },
  { id: 9000000, title: 'O Homem e Seus Símbolos', author: 'Carl Gustav Jung', category: 'Filosofia', cover_url: 'homemeseussimbolos.jpg', isPlaceholder: true, slug: 'o-homem-e-seus-simbolos' },
  { id: 10000000, title: 'As Dores do Mundo', author: 'Arthur Schopenhauer', category: 'Filosofia', cover_url: 'asdoresdomundo.jpg', isPlaceholder: true, slug: 'as-dores-do-mundo' },
  { id: 11000000, title: 'A Obscena Senhora D', author: 'Hilda Hilst', category: 'Romance', cover_url: 'aobscenasenhorad.jpg', isPlaceholder: true, slug: 'a-obscena-senhora-d' },
  { id: 12000000, title: 'A Hora da Estrela', author: 'Clarice Lispector', category: 'Romance', cover_url: 'ahoradaestrela.jpg', isPlaceholder: true, slug: 'a-hora-da-estrela' },
  { id: 13000000, title: 'O Delicado Abismo da Loucura', author: 'Raimundo Carrero', category: 'Romance', cover_url: 'delicadoabismo.jpg', isPlaceholder: true, slug: 'o-delicado-abismo-da-loucura' },
  { id: 14000000, title: 'Quarto de Despejo', author: 'Carolina Maria de Jesus', category: 'Não-ficção', cover_url: 'quartodedespejo.jpg', isPlaceholder: true, slug: 'quarto-de-despejo' },
  { id: 15000000, title: 'O Diário de Anne Frank', author: 'Anne Frank', category: 'Não-ficção', cover_url: 'diariodeannefrank.jpg', isPlaceholder: true, slug: 'o-diario-de-anne-frank' }
];

export default mockLivros;
