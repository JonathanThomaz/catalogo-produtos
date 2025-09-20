# 🛒 API Catálogo de Produtos

API REST desenvolvida com Node.js, TypeScript, Express e PostgreSQL para gerenciamento de catálogo de produtos.

## 📋 Funcionalidades

- ✅ CRUD completo de produtos (Create, Read, Update, Delete)
- ✅ Banco PostgreSQL com Docker
- ✅ ORM Prisma com migrations e seed
- ✅ Documentação Swagger/OpenAPI
- ✅ Validação de dados e tratamento de erros
- ✅ TypeScript com tipagem rigorosa
- ✅ Logs estruturados

## 🛠️ Tecnologias

- **Node.js** + **TypeScript**
- **Express.js** (Framework web)
- **PostgreSQL 15** (Banco de dados)
- **Prisma** (ORM)
- **Docker & Docker Compose**
- **Swagger UI** (Documentação)

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- Docker e Docker Compose
- Git

### 1️⃣ Clone o repositório

```bash
git clone <url-do-repositorio>
cd catalogo-produtos
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Configure as variáveis de ambiente

O arquivo `.env` já está configurado com valores padrão. Se necessário, ajuste:

```env
# Configuração do Banco de Dados
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=catalogo_produtos
DB_HOST=localhost
DB_PORT=5432

# URL de conexão do Prisma
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

# Configuração da API
PORT=3000
NODE_ENV=development
```

### 4️⃣ Suba o banco PostgreSQL com Docker

```bash
docker-compose up -d
```

Verifique se o container está rodando:
```bash
docker-compose ps
```

### 5️⃣ Execute as migrations do Prisma

```bash
npm run prisma:migrate
```

### 6️⃣ Gere o cliente Prisma

```bash
npm run prisma:generate
```

### 7️⃣ Execute o seed (popular banco com dados)

```bash
npm run seed
```

### 8️⃣ Inicie a API

#### Modo desenvolvimento (com hot reload):
```bash
npm run dev
```

#### Modo produção:
```bash
npm run build
npm start
```

A API estará disponível em:
- 🌐 **API**: http://localhost:3000
- 📚 **Endpoints**: http://localhost:3000/api/products
- 📖 **Documentação Swagger**: http://localhost:3000/api-docs

## 📚 Endpoints da API

### Status da API
- `GET /` - Retorna status da API

### Produtos
- `GET /api/products` - Lista todos os produtos
- `GET /api/products/:id` - Busca produto por ID
- `POST /api/products` - Cria novo produto
- `PUT /api/products/:id` - Atualiza produto
- `DELETE /api/products/:id` - Remove produto

### Exemplos de Uso

#### Criar produto:
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Smartphone XYZ",
    "description": "Smartphone com 128GB de armazenamento",
    "price": 899.99
  }'
```

#### Listar produtos:
```bash
curl http://localhost:3000/api/products
```

#### Buscar produto por ID:
```bash
curl http://localhost:3000/api/products/1
```

## 🗃️ Modelo do Produto

```typescript
interface Product {
  id: number;           // ID único (auto increment)
  title: string;        // Nome do produto
  description: string;  // Descrição detalhada
  price: Decimal;       // Preço (precisão decimal)
  createdAt: DateTime;  // Data de criação
  updatedAt: DateTime;  // Data de atualização
}
```

## 📝 Scripts Disponíveis

```json
{
  "build": "tsc",                    // Compila TypeScript
  "start": "node dist/server.js",    // Inicia em produção
  "dev": "nodemon src/server.ts",    // Desenvolvimento com hot reload
  "seed": "tsx prisma/seed.ts",      // Popula banco com dados
  "prisma:migrate": "prisma migrate dev",      // Executa migrations
  "prisma:generate": "prisma generate",        // Gera cliente Prisma
  "prisma:studio": "prisma studio"             // Interface visual do banco
}
```

## 🐳 Docker Commands

```bash
# Subir apenas o banco
docker-compose up -d postgres

# Ver logs do banco
docker-compose logs postgres

# Parar e remover containers
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados)
docker-compose down -v
```

## 📊 Prisma Studio

Para visualizar e editar dados via interface gráfica:

```bash
npm run prisma:studio
```

Acesse: http://localhost:5555

## 🔧 Estrutura do Projeto

```
catalogo-produtos/
├── src/
│   ├── config/         # Configurações (Swagger)
│   ├── controllers/    # Controladores da API
│   ├── routes/        # Definição de rotas
│   ├── database.ts    # Conexão com banco
│   └── server.ts      # Servidor principal
├── prisma/
│   ├── schema.prisma  # Schema do banco
│   └── seed.ts        # Dados iniciais
├── docker-compose.yml # Configuração Docker
├── .env              # Variáveis de ambiente
└── package.json      # Dependências e scripts
```

## 🚨 Solução de Problemas

### Erro de conexão com banco
1. Verifique se o Docker está rodando
2. Execute `docker-compose ps` para ver status dos containers
3. Verifique as variáveis de ambiente no `.env`

### Erro nas migrations
```bash
# Reset do banco (CUIDADO: apaga dados)
npx prisma migrate reset

# Forçar nova migration
npx prisma migrate dev --name init
```

### Porta em uso
Altere a `PORT` no arquivo `.env` ou pare o processo:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

## 📄 Licença

Este projeto está sob a licença ISC.

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando Node.js + TypeScript + PostgreSQL**