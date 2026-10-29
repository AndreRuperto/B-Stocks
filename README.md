# B-Stocks — Sistema de Análise Quantitativa e Fundamentalista da B3

O **B-Stocks** é uma plataforma fullstack 100% gratuita em **TypeScript** para análise fundamentalista, técnica e quantitativa de todas as ações listadas na B3 (Brasil, Bolsa, Balcão). O sistema coleta em lote todos os ativos da B3, calcula modelos matemáticos determinísticos no backend (**Preço Teto de Décio Bazin**, **Preço Justo de Benjamin Graham**, **Médias Móveis SMA 50/200**, **IFR/RSI de 14 períodos** e **Score Ponderado de 0 a 100**) e gera **Teses de Investimento sob demanda via Inteligência Artificial**.

---

## Stack Tecnológica

### Backend (`/backend`)
- **Linguagem:** TypeScript
- **Runtime & Framework:** Node.js + NestJS
- **Banco de Dados & ORM:** PostgreSQL (`b-stocks`) + Prisma ORM
- **Requisições HTTP & Scraping:** Axios + Cheerio
- **Validação de Dados:** Zod
- **Testes Automatizados:** Jest + Supertest (Unitários e Integração E2E)

### Frontend (`/frontend`)
- **Linguagem:** TypeScript
- **Framework:** Next.js 14 (App Router) + React 18
- **Componentes & Estilo:** Shadcn UI + Tailwind CSS (Interface sólida e neutra em tons de Zinc, sem gradientes ou efeitos visuais exagerados)
- **Validação de Formulários e Contratos:** Zod
- **Testes End-to-End (E2E):** Playwright

---

## Documentação Detalhada

- [Arquitetura do Sistema e Fluxo de Dados](docs/ARCHITECTURE.md)
- [Modelos Matemáticos e Algoritmo de Score (0 a 100)](docs/MATHEMATICAL_MODELS.md)
- [Referência Completa da API REST](docs/API_REFERENCE.md)

---

## Como Executar o Projeto

### 1. Pré-requisitos
- **Node.js** v20+ (ou v24+)
- **PostgreSQL** ativo na porta `5432` com o banco `b-stocks` criado

### 2. Configuração de Variáveis de Ambiente
Copie os arquivos `.env.example` em `backend/.env` e `frontend/.env` e configure suas credenciais locais:

**`backend/.env`**:
```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/b-stocks?schema=public"
PORT=3001
GEMINI_API_KEY=""
GROQ_API_KEY=""
BRAPI_TOKEN=""
```

**`frontend/.env`**:
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

### 3. Instalação e Sincronização do Backend
```powershell
cd backend
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run start:dev
```

### 4. Instalação e Execução do Frontend
```powershell
cd frontend
npm install
npm run dev
```
Acesse `http://localhost:3000`.

---

## Como Executar os Testes

### Testes Unitários do Backend (Jest)
```powershell
cd backend
npm test
```

### Testes de Integração E2E do Backend (Jest + Supertest)
```powershell
cd backend
npm run test:e2e
```

### Testes End-to-End do Frontend (Playwright)
Com o backend (`localhost:3001`) e o frontend (`localhost:3000`) em execução:
```powershell
cd frontend
npx playwright test
```

