# Vitta+ (Premium)

Aplicação web fullstack para gestão de **atendimentos de saúde**, com:

- Autenticação de usuários (login e cadastro)
- Painel (dashboard) protegido por JWT
- Módulo de **agendamentos** (CRUD integrado ao Firestore)
- Módulo de **chamadas em vídeo** (WebRTC + backend Node)
- Layout moderno em Angular, pensado para uso em desktop e mobile (via navegador)

> Este README foi pensado para o professor / avaliador conseguir **instalar, rodar e entender** o projeto sem precisar falar com o autor.

---

## 🧱 Estrutura do projeto

```text
vitta-plus-premium/
├─ backend/         # API REST em Node.js + Express + Firebase Admin + Firestore
└─ frontend/        # SPA em Angular (standalone components) consumindo a API
```

---

## 🚀 Tecnologias utilizadas

### Frontend

- **Angular** (standalone components, `provideRouter`, `provideHttpClient`)
- **TypeScript**
- **HTML + CSS**
- **Tailwind / Utility classes** (layout moderno)
- **HttpClient + Interceptor**
  - Anexa `Authorization: Bearer <token>` em todas as requisições autenticadas
- **LocalStorage**
  - Persistência do JWT com a chave `vitta_token`

### Backend

- **Node.js**
- **Express**
- **TypeScript** (compilado com `tsc` para a pasta `dist/`)
- **Firebase Admin SDK**
  - Firestore como banco de dados
- **bcryptjs**
  - Criptografia de senha
- **jsonwebtoken**
  - Geração e validação de tokens JWT
- **CORS**
  - Liberação do frontend (`http://localhost:4200` em desenvolvimento)
- **dotenv**
  - Leitura de variáveis de ambiente a partir do arquivo `.env`

### Infra / Serviços

- **Firebase Project**
  - Firestore (modo production)
  - Credenciais de serviço (Service Account) usadas no backend

---

## 🧩 Funcionalidades principais

### 🔐 Autenticação

- **Cadastro** (`/auth/register`)
  - Recebe `email` e `password`
  - Salva usuário em uma coleção `users` no Firestore
  - Senha é armazenada como **hash** gerado pelo `bcryptjs`
- **Login** (`/auth/login`)
  - Valida usuário e senha
  - Gera **JWT** com:
    - `uid` (id do documento no Firestore)
    - `email`
  - Retorna `{ token, userId, email }`

No frontend:

- O token é salvo em `localStorage` com a chave `vitta_token`
- O **AuthInterceptor** adiciona automaticamente o cabeçalho:

```http
Authorization: Bearer <token>
```

para todas as chamadas protegidas (agendamentos, chamadas etc.).

---

### 📅 Agendamentos

- Rota base do backend: `/agendamentos`
- Protegida pelo middleware de autenticação (JWT)
- Cada agendamento está associado a um **usuário** (`userId`)

Estrutura básica no Firestore (coleção `agendamentos`):

```ts
{
  userId: string
  medico: string
  data: string
  horario: string
  status: "ativo"
  createdAt: string // ISO
}
```

#### Endpoints

- `GET /agendamentos`  
  Lista agendamentos do usuário autenticado (filtra por `userId`).
- `POST /agendamentos`  
  Cria um agendamento novo.
- `DELETE /agendamentos/:id`  
  Remove um agendamento pertencente ao usuário.

#### Observação importante (Firestore index)

A listagem usa um `where("userId", "==", uid).orderBy("createdAt", "desc")`.  
No primeiro deploy, o Firestore pode pedir a criação de um **índice composto**.  
Basta seguir o link gerado no erro ou criar um índice manualmente:

- Coleção: `agendamentos`
- Campos:
  - `userId` (Ascending)
  - `createdAt` (Descending)

---

### 📹 Chamadas em vídeo (WebRTC)

- Módulo disponível em `/chamadas` no backend.
- Frontend permite:
  - Criar uma **sala** de chamada
  - Enviar o código da sala para outro usuário
  - Mostrar localmente:
    - **Vídeo local** (usuário atual)
    - **Vídeo remoto** (quando outro participante entra)

> Observação: como o projeto está rodando **localmente**, para testar com 2 usuários é recomendado:
> - Abrir uma aba anônima + uma aba normal; ou
> - Usar outro navegador; e
> - Permitir acesso à câmera e microfone nos dois.

---

## 🛠️ Como rodar o projeto

### 1. Requisitos

- **Node.js** 18+ (recomendado 20+)
- **npm** (ou `pnpm` / `yarn`, se preferir)
- Uma conta no **Firebase** com um projeto criado
- Uma **Service Account** do Firebase (JSON) para ser usada no backend

---

### 2. Configurando o backend

1. Entre na pasta:

```bash
cd backend
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na pasta `backend/` com este modelo:

```env
PORT=3333

JWT_SECRET=uma_senha_bem_segura_aqui

FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_CLIENT_EMAIL=seu-client-email@seu-project-id.iam.gserviceaccount.com

# IMPORTANTE:
# - Copie o "private_key" do JSON da service account
# - Substitua QUEBRAS DE LINHA reais por "
"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
...sua chave...
-----END PRIVATE KEY-----
"

FIREBASE_PRIVATE_KEY_ID=opcional_somente_para_controle
```

4. Compile o TypeScript:

```bash
npm run build
```

5. Inicie o servidor:

```bash
npm start
```

Se estiver tudo certo, aparecerá algo como:

```text
Vitta+ backend rodando na porta 3333
```

Você pode testar no navegador:

- `http://localhost:3333/health`  
  Deve responder com:

```json
{ "status": "ok", "service": "vitta-plus-backend" }
```

---

### 3. Configurando o frontend (Angular)

1. Entre na pasta:

```bash
cd frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo `src/app/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  backendUrl: "http://localhost:3333",
  firebaseConfig: {
    apiKey: "SUA_API_KEY",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:abcdef123456"
  }
};
```

> Em ambiente real, use também um `environment.prod.ts` separado.

4. Rodar o frontend:

```bash
npm start
# ou
ng serve
```

Abra no navegador:

- `http://localhost:4200`

---

## 🔑 Fluxo básico de uso (para testes)

1. **Rodar backend** na porta `3333`.
2. **Rodar frontend** na porta `4200`.
3. Acessar `http://localhost:4200` no navegador.
4. Criar um novo usuário na tela de **cadastro**.
5. Fazer login com e-mail e senha criados.
6. Acessar:
   - **Dashboard**
   - **Agendamentos**: criar, listar e remover
   - **Chamadas**: criar sala e testar vídeo

---

## 🧪 Testando em outro dispositivo (mesma rede)

Para abrir o frontend e backend no **celular** (na mesma rede Wi‑Fi):

1. Descobrir o IP da máquina (ex.: `192.168.1.3`).
2. No `environment.ts`:

```ts
backendUrl: "http://192.168.1.3:3333",
```

3. Rodar:

```bash
# backend
cd backend
npm start

# frontend
cd frontend
ng serve --host 0.0.0.0 --disable-host-check
```

4. No celular, acessar:

- `http://192.168.1.3:4200`

> Se der erro de CORS, basta ajustar a configuração de `cors` no backend para permitir também `http://192.168.1.3:4200` como `origin`.

---

## 📁 Itens que **não** devem subir para o Git

O repositório deve ter um `.gitignore` cobrindo pelo menos:

```gitignore
# Dependências
node_modules/

# Build
dist/

# Credenciais sensíveis
.env
.env.local
.env.*.local
```

As credenciais do Firebase e o arquivo `.env` **nunca** devem ir para o GitHub.

---

## 📌 Observações finais

- O projeto está organizado para ser **didático**: cada módulo (auth, agendamentos, chamadas) tem controller, service e rotas separados no backend.
- O frontend usa **Angular standalone** (sem `NgModule` raiz) e organização em `pages/` + `core/` (services, guards, components genéricos).
- Qualquer dúvida sobre build, fluxo de autenticação ou integração com Firebase pode ser identificada rapidamente olhando:
  - `backend/src/app.ts`
  - `backend/src/routes/*.routes.ts`
  - `backend/src/services/*.ts`
  - `frontend/src/app/core/services/*.ts`
  - `frontend/src/app/pages/*/*.component.ts`

---

Feito com 🩵 em Node.js, Angular e Firebase.
