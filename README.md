# mini-e-commerce

Mini e-commerce em React + TypeScript que consome a [FakeStore API](https://fakestoreapi.com) como back-end. Inclui autenticação, catálogo, carrinho persistente por usuário e painel administrativo (CRUD de produtos e usuários).

---

## 🎨 Design do Projeto
O layout deste projeto foi desenvolvido no Figma, seguindo uma estética premium/minimalista.
- [Link para o protótipo no Figma](https://www.figma.com/design/OFK0IauKzmTHMELUPVlB0b/teste-frontend?node-id=0-1&t=UOhPKAPArzCJ5APs-1)

---

## Funcionalidades

**Autenticação** via FakeStore (`/auth/login`) com sessão persistida em `localStorage`.
**Catálogo** com busca, filtro por categoria e listagem de produtos.
**Detalhe do produto** com seleção de quantidade.
**Carrinho** persistente por usuário e checkout simulado.
**Painel administrativo** (rota protegida por role `admin`):
Dashboard com métricas.
CRUD de produtos.
CRUD de usuários.
**Tema claro/escuro** com persistência da preferência.
**Acessibilidade básica**: labels, `alt` em imagens, foco visível.

---

## 🧰 Stack

**React 19** + **TypeScript**
**Vite** (build/dev server)
**React Router 7** (rotas)
**Zustand** (estado global)
**Zod** (validação de formulários)
**Tailwind CSS 4** (estilos)
**Lucide Icons**
**Vitest** + **Testing Library** (testes)

---

## ✅ Pré-requisitos

**Node.js 20+** (recomendado 20 LTS ou superior)
**npm 10+** (já vem com o Node)
Conexão à internet (a app consome a API pública `https://fakestoreapi.com`)

Verifique sua versão:

```bash
node -v
npm -v
```

---

## Como rodar localmente

### 1. Clone o repositório

```bash
git clone <url-do-repositório>
cd mini-e-commerce
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o template e ajuste se necessário:

```bash
# Linux / macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Conteúdo padrão do `.env`:

```env
VITE_API_BASE_URL=https://fakestoreapi.com
```

> ⚠️ Apenas variáveis com prefixo `VITE_` são expostas ao bundle do navegador. **Nunca** coloque segredos reais aqui.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em **http://localhost:5173**.

---

## Credenciais de teste

A FakeStore API fornece usuários públicos. Use, por exemplo:

| Usuário      | Senha          |
|--------------|----------------|
| `mor_2314`   | `83r5^_`       |
| `johnd`      | `m38rmF$`      |

> O papel (`admin` / `customer`) é atribuído pela aplicação após o login. Consulte `src/services/authService.ts` para ver/ajustar a regra de quais usuários acessam o painel admin.

---

## Scripts disponíveis


 `npm run dev`         Inicia o servidor de desenvolvimento (Vite).      
 `npm run build`       Type-check (`tsc -b`) + build de produção.         
 `npm run preview`     Servidor local sobre o build de produção.          
 `npm run lint`        Roda o ESLint em todo o projeto.                   
 `npm test`            Executa a suíte de testes uma única vez.           
 `npm run test:watch`  Executa os testes em modo watch.                   
 `npm run test:ui`     Abre a UI interativa do Vitest.                    

---

## 🗂️ Estrutura de pastas

```
src/
├── api/            # Cliente HTTP e endpoints (FakeStore)
├── components/     # UI primitives, layout e produtos
├── context/        # Theme context
├── hooks/          # Hooks reutilizáveis
├── pages/          # Páginas (login, customer, admin)
├── routes/         # Configuração do React Router
├── services/       # Camada de serviço (auth, products, users, storage)
├── store/          # Stores Zustand (auth, cart, products, user)
├── test/           # Testes unitários
├── types/          # Tipos compartilhados
└── utils/          # Helpers (cn, format, validation)
```

---

## Testes

```bash
npm test           # roda uma vez
npm run test:watch # modo watch
npm run test:ui    # interface gráfica
```

---

## Build de produção

```bash
npm run build
npm run preview   # serve o ./dist localmente para validação
```

O artefato final fica em `./dist`.

---

## Variáveis de ambiente

| Variável             | Obrigatória | Padrão                       | Descrição                                       |
|----------------------|-------------|------------------------------|-------------------------------------------------|
| `VITE_API_BASE_URL`  | Não         | `https://fakestoreapi.com`   | URL base da API consumida pelo cliente.         |

> Se a variável não for definida, o cliente cai no valor padrão em `src/api/client.ts`.

---

## Troubleshooting

- **`npm run dev` falha com erro de versão do Node**: atualize para Node 20+.
- **Tela em branco / 401 ao logar**: confirme que `VITE_API_BASE_URL` aponta para `https://fakestoreapi.com` e que há internet.
- **Tailwind não aplica estilos**: pare o `dev`, delete `node_modules/.vite` e rode novamente.
- **Variáveis `.env` não carregam**: o Vite só lê o `.env` na inicialização — reinicie o servidor após alterar.

---

## 📄 Licença

Veja [LICENSE](LICENSE).
