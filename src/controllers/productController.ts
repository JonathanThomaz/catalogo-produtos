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
      const id = parseInt(req.params.id);

      const product = await prisma.product.findUnique({
        where: { id }
      });

      if (!product) {
        return res.status(404).json({
          error: 'Produto não encontrado',
          message: `Produto com ID ${id} não foi encontrado`
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

      const product = await prisma.product.create({
        data: {
          title,
          description,
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
      const id = parseInt(req.params.id);
      const { title, description, price } = req.body;

      // Verificar se o produto existe
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });

      if (!existingProduct) {
        return res.status(404).json({
          error: 'Produto não encontrado',
          message: `Produto com ID ${id} não foi encontrado`
        });
      }

      // Preparar dados para atualização
      const updateData: any = {};
      
      if (title !== undefined) {
        updateData.title = title;
      }

      if (description !== undefined) {
        updateData.description = description;
      }

      if (price !== undefined) {
        updateData.price = new Decimal(price);
      }

      const product = await prisma.product.update({
        where: { id },
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
      const id = parseInt(req.params.id);

      // Verificar se o produto existe
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      });

      if (!existingProduct) {
        return res.status(404).json({
          error: 'Produto não encontrado',
          message: `Produto com ID ${id} não foi encontrado`
        });
      }

      await prisma.product.delete({
        where: { id }
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
