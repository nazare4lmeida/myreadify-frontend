# 📚 MyReadify – Frontend

<p align="center">
  <a href="https://myreadify.vercel.app/" target="_blank">
    <img src="src/assets/myreadify-logo.JPG" alt="MyReadify Logo" width="250"/>
</p>

Interface web do projeto **MyReadify**, uma plataforma focada em leitura colaborativa, onde usuários podem enviar e gerenciar resumos de livros. Esta aplicação frontend interage diretamente com a API do [MyReadify Backend](https://github.com/nazare4lmeida/myreadify-backend).

---

## ✨ Demonstração ao Vivo

Acesse a aplicação em produção: [**MyReadify App**](https://myreadify-frontend.vercel.app/) 

----------------------------------------

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias e bibliotecas:

* **Desenvolvimento:**
    * [**React**](https://react.dev/) (v18+) - Biblioteca JavaScript para construção de interfaces de usuário.
    * [**Vite**](https://vitejs.dev/) - Ferramenta de build rápido para desenvolvimento frontend.
    * **CSS Puro** - Estilização completa da aplicação sem uso de frameworks CSS como Tailwind.
* **Roteamento:**
    * [**React Router DOM**](https://reactrouter.com/) - Gerenciamento de rotas e navegação na aplicação.
* **Requisições HTTP:**
    * [**Axios**](https://axios-http.com/) - Cliente HTTP baseado em Promises para fazer requisições à API.
* **Autenticação e Banco de Dados (via Backend):**
    * [**Supabase**](https://supabase.com/) - Utilizado no backend como serviço de banco de dados.
* **Deploy:**
    * [**Vercel**](https://vercel.com/) - Plataforma para hospedagem e deploy contínuo.
* **Outros:**
    * **Responsividade** - Layout adaptável para desktop e dispositivos móveis (tablets e celulares).

---

## 📁 Estrutura de Pastas

A estrutura do projeto está organizada de forma modular para facilitar a manutenção e escalabilidade:

```
myreadify-frontend/
│
├── src/
│   ├── assets/              \# Imagens estáticas 
│   ├── components/          \# Componentes React reutilizáveis 
│   ├── contexts/            \# Contextos React para gerenciamento de estado global
│   ├── data/         
│   ├── pages/               \# Componentes que representam páginas completas da aplicação 
│   ├── styles/              \# Css voltado para toda a aplicação
│   ├── services/            \# Configurações de serviços e chamadas à API 
│   ├── utils/               \# Funções utilitárias diversas 
│   ├── App.jsx              \# Componente principal que define a estrutura da aplicação e as rotas
│   └── main.jsx             \# Ponto de entrada da aplicação React
├── index.html               \# Ponto de entrada HTML
├── package.json             \# Dependências e scripts do projeto
└── README.md                \# Este arquivo
```

---

## ⚙️ Instalação e Execução Local

Para configurar e rodar o projeto em sua máquina local:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/nazare4lmeida/myreadify-frontend.git
    cd myreadify-frontend
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou yarn install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto (`myreadify-frontend/.env`) e adicione a seguinte variável, apontando para a URL onde seu backend está rodando (geralmente `http://localhost:3000` em ambiente de desenvolvimento):

    ```
    VITE_API_URL=http://localhost:3000
    ```

    *Certifique-se de que seu [backend](https://github.com/nazare4lmeida/myreadify-backend) esteja em execução para que o frontend possa se comunicar com a API.*

4.  **Rode o projeto localmente:**
    ```bash
    npm run dev
    # ou yarn dev
    ```
    O aplicativo estará disponível em `http://localhost:5173` (ou outra porta disponível).

---

## 📦 Deploy

Este projeto está configurado para ser facilmente implantado na **Vercel**.

Para realizar um build de produção:

```bash
npm run build
# ou yarn build
```

O diretório dist/ será gerado com os arquivos otimizados para produção.

## 🧠 Funcionalidades Principais

**MyReadify** oferece as seguintes funcionalidades no frontend:

**Cadastro e Login de Usuários:** Permite que novos usuários se registrem e usuários existentes façam login para acessar as funcionalidades da plataforma.

**Envio de Resumos:** Usuários logados podem enviar resumos de livros para avaliação.

**Envio de avaliação:** Usuários logados podem avaliar livros e deixar um comentário sobre cada um deles.

**Meus Envios:** Visualização do histórico de resumos enviados pelo usuário, com seus respectivos status (pendente, aprovado, rejeitado).

**Listagem e Detalhes de Livros:** Exibição de livros com resumos aprovados.

**Painel Administrativo:** (Acesso restrito) Interface para administradores gerenciarem os resumos pendentes e aprovados/rejeitá-los, além de outras ações de gerenciamento.

**Página de Contato:** Formulário para os usuários entrarem em contato (a funcionalidade de envio de email é gerenciada pelo backend via Nodemailer).

**Design Responsivo:** Experiência de usuário otimizada em diferentes tamanhos de tela (desktop, tablet, mobile).

## 🔗 Backend do Projeto: MyReadify Backend Repository

## 👩‍💻 Autora

Feito por Nazaré Almeida, estudante de Análise e Desenvolvimento de Sistemas e leitora assídua.
