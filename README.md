# 📚 MyReadify – Frontend

Interface web do projeto [MyReadify](https://github.com/nazare4lmeida/myreadify-backend), focado em leitura colaborativa.

---

## 🚀 Tecnologias Utilizadas

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [React Router DOM](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- Integração com Supabase (backend)
- Responsivo para desktop e mobile
- Deploy: [Vercel](https://vercel.com/)

---

## 📁 Estrutura de Pastas (principais)

```
myreadify-frontend/
│
├── src/
│   ├── assets/           # Imagens e ícones
│   ├── components/       # Componentes reutilizáveis
│   ├── pages/            # Páginas (Login, Home, etc)
│   ├── routes/           # Definições de rotas
│   ├── services/         # Configuração do Axios
│   └── App.jsx           # Componente principal
├── public/
├── index.html
└── tailwind.config.js
```

---

## ⚙️ Instalação e Execução

```bash
# Clone o repositório
git clone https://github.com/nazare4lmeida/myreadify-frontend.git
cd myreadify-frontend

# Instale as dependências
npm install

# Rode o projeto localmente
npm run dev
```

---

## 🌐 Variáveis de Ambiente

Crie um arquivo `.env` com a seguinte variável:

```
VITE_API_URL=http://localhost:3000
```

Aponte para a URL onde seu backend está rodando.

## 📦 Deploy

O projeto está configurado para ser facilmente hospedado na **Vercel**.

```bash
# Build de produção
npm run build
```

---

## 🧠 Funcionalidades

- Cadastro e login de usuários
- Upload e listagem de livros
- Avaliação com resenhas
- Painel administrativo
- Página de contato
- Tema moderno e responsivo

---

🔗 **Backend**: [Repositório](https://github.com/nazare4lmeida/myreadify-backend)


Feito por Nazaré Almeida
