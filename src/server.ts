import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDatabase, disconnectDatabase } from "./database";
import productRoutes from "./routes/productRoutes";
import authRoutes from "./routes/authRoutes";
import { setupSwagger } from "./config/swagger";

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS, dessa maneira é possivel inserir outras configurações específicas e gerenciar pelo menos as origens via env
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
};

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Configurar Swagger
setupSwagger(app);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Status da API
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: API funcionando
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiStatus'
 */
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "API Catálogo de Produtos funcionando!",
    timestamp: new Date().toISOString(),
  });
});

// Rotas da API
app.use("/api", productRoutes);
app.use("/api/auth", authRoutes);

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Encerrando servidor...");
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Encerrando servidor...");
  await disconnectDatabase();
  process.exit(0);
});

// Inicialização do servidor
async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Acesse: http://localhost:${PORT}`);
      console.log(`📚 API: http://localhost:${PORT}/api/products`);
      console.log(`📖 Swagger: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
}

startServer();

export default app;
