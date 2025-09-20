import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Catálogo de Produtos',
      version: '1.0.0',
      description: 'API REST para gerenciamento de catálogo de produtos desenvolvida com Node.js, TypeScript, Express e PostgreSQL',
      contact: {
        name: 'Suporte API',
        email: 'suporte@catalogo.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do produto',
              example: 1
            },
            title: {
              type: 'string',
              description: 'Nome do produto',
              example: 'iPhone 15 Pro'
            },
            description: {
              type: 'string',
              description: 'Descrição detalhada do produto',
              example: 'O mais avançado iPhone com chip A17 Pro...'
            },
            price: {
              type: 'string',
              description: 'Preço do produto (Decimal)',
              example: '7999.99'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
              example: '2024-01-15T10:30:00Z'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização',
              example: '2024-01-15T10:30:00Z'
            }
          }
        },
        ProductInput: {
          type: 'object',
          required: ['title', 'description', 'price'],
          properties: {
            title: {
              type: 'string',
              description: 'Nome do produto',
              example: 'iPhone 15 Pro'
            },
            description: {
              type: 'string',
              description: 'Descrição detalhada do produto',
              example: 'O mais avançado iPhone com chip A17 Pro...'
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Preço do produto',
              example: 7999.99
            }
          }
        },
        ProductUpdate: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Nome do produto',
              example: 'iPhone 15 Pro Max'
            },
            description: {
              type: 'string',
              description: 'Descrição detalhada do produto',
              example: 'O mais avançado iPhone com tela maior...'
            },
            price: {
              type: 'number',
              minimum: 0,
              description: 'Preço do produto',
              example: 8999.99
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Tipo do erro',
              example: 'Produto não encontrado'
            },
            message: {
              type: 'string',
              description: 'Mensagem descritiva do erro',
              example: 'Produto com ID 999 não foi encontrado'
            }
          }
        },
        ApiStatus: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok'
            },
            message: {
              type: 'string',
              example: 'API Catálogo de Produtos funcionando!'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-15T10:30:00Z'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const specs = swaggerJSDoc(options);

export function setupSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API Catálogo - Documentação"
  }));
}

export default specs;