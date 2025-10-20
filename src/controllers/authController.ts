import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../database";
import { registerSchema, loginSchema } from "../schemas/authSchemas";
import { AuthRequest } from "../middleware/authMiddleware";

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const validation = registerSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          error: "Dados inválidos",
          details: validation.error.issues,
        });
        return;
      }

      const { email, password } = validation.data;

      // Verificar se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(400).json({ error: "Email já cadastrado" });
        return;
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      // Gerar token JWT
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        res.status(500).json({ error: "Configuração do servidor inválida" });
        return;
      }

      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: "7d",
      });

      res.status(201).json({
        message: "Usuário registrado com sucesso",
        token,
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const validation = loginSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          error: "Dados inválidos",
          details: validation.error.issues,
        });
        return;
      }

      const { email, password } = validation.data;

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        res.status(401).json({ error: "Credenciais inválidas" });
        return;
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({ error: "Credenciais inválidas" });
        return;
      }

      // Gerar token JWT
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        res.status(500).json({ error: "Configuração do servidor inválida" });
        return;
      }

      const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: "7d",
      });

      res.json({
        message: "Login realizado com sucesso",
        token,
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ error: "Não autorizado" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      });

      if (!user) {
        res.status(404).json({ error: "Usuário não encontrado" });
        return;
      }

      res.json(user);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export default new AuthController();
