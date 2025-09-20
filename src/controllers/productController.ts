import { Request, Response } from 'express';
import prisma from '../database';
import { Decimal } from '@prisma/client/runtime/library';

export class ProductController {
  // GET /products - Listar todos os produtos
  async getAllProducts(req: Request, res: Response): Promise<Response> {
    try {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
      });
      
      return res.json(products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Não foi possível buscar os produtos'
      });
    }
  }

  // GET /products/:id - Buscar produto por ID
  async getProductById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const productId = parseInt(id);

      if (isNaN(productId)) {
        return res.status(400).json({
          error: 'ID inválido',
          message: 'O ID deve ser um número válido'
        });
      }

      const product = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!product) {
        return res.status(404).json({
          error: 'Produto não encontrado',
          message: `Produto com ID ${productId} não foi encontrado`
        });
      }

      return res.json(product);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Não foi possível buscar o produto'
      });
    }
  }

  // POST /products - Criar novo produto
  async createProduct(req: Request, res: Response): Promise<Response> {
    try {
      const { title, description, price } = req.body;

      // Validação básica
      if (!title || !description || price === undefined) {
        return res.status(400).json({
          error: 'Dados obrigatórios',
          message: 'Título, descrição e preço são obrigatórios'
        });
      }

      if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({
          error: 'Preço inválido',
          message: 'O preço deve ser um número positivo'
        });
      }

      const product = await prisma.product.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          price: new Decimal(price)
        }
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Não foi possível criar o produto'
      });
    }
  }

  // PUT /products/:id - Atualizar produto
  async updateProduct(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { title, description, price } = req.body;
      const productId = parseInt(id);

      if (isNaN(productId)) {
        return res.status(400).json({
          error: 'ID inválido',
          message: 'O ID deve ser um número válido'
        });
      }

      // Verificar se o produto existe
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!existingProduct) {
        return res.status(404).json({
          error: 'Produto não encontrado',
          message: `Produto com ID ${productId} não foi encontrado`
        });
      }

      // Preparar dados para atualização
      const updateData: any = {};
      
      if (title !== undefined) {
        if (typeof title !== 'string' || title.trim().length === 0) {
          return res.status(400).json({
            error: 'Título inválido',
            message: 'O título deve ser uma string não vazia'
          });
        }
        updateData.title = title.trim();
      }

      if (description !== undefined) {
        if (typeof description !== 'string') {
          return res.status(400).json({
            error: 'Descrição inválida',
            message: 'A descrição deve ser uma string'
          });
        }
        updateData.description = description.trim();
      }

      if (price !== undefined) {
        if (typeof price !== 'number' || price < 0) {
          return res.status(400).json({
            error: 'Preço inválido',
            message: 'O preço deve ser um número positivo'
          });
        }
        updateData.price = new Decimal(price);
      }

      const product = await prisma.product.update({
        where: { id: productId },
        data: updateData
      });

      return res.json(product);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Não foi possível atualizar o produto'
      });
    }
  }

  // DELETE /products/:id - Remover produto
  async deleteProduct(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const productId = parseInt(id);

      if (isNaN(productId)) {
        return res.status(400).json({
          error: 'ID inválido',
          message: 'O ID deve ser um número válido'
        });
      }

      // Verificar se o produto existe
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!existingProduct) {
        return res.status(404).json({
          error: 'Produto não encontrado',
          message: `Produto com ID ${productId} não foi encontrado`
        });
      }

      await prisma.product.delete({
        where: { id: productId }
      });

      return res.status(204).send();
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Não foi possível deletar o produto'
      });
    }
  }
}