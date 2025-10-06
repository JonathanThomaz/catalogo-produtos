import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

/**
 * Interface para definir onde aplicar a validação
 * Segue o princípio de Interface Segregation - interfaces específicas
 */
interface ValidationTarget {
  body?: z.ZodSchema<any>;
  params?: z.ZodSchema<any>;
  query?: z.ZodSchema<any>;
}

/**
 * Classe responsável por formatar erros de validação
 */
export class ValidationErrorFormatter {
  static formatZodError(error: ZodError): { error: string; message: string; details: string[] } {
    const details = error.issues.map((err: any) => {
      const path = err.path.length > 0 ? `${err.path.join('.')}: ` : '';
      return `${path}${err.message}`;
    });

    return {
      error: 'Dados inválidos',
      message: 'Os dados fornecidos não são válidos',
      details
    };
  }

  static formatGeneralError(error: any): { error: string; message: string } {
    return {
      error: 'Erro de validação',
      message: error.message || 'Erro desconhecido na validação'
    };
  }
}

/**
 * Classe principal para validação de requests
 */
export class RequestValidator {
  private static validateData<T>(schema: z.ZodSchema<T>, data: any): T {
    return schema.parse(data);
  }

  static create(targets: ValidationTarget) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // Validar parâmetros da URL
        if (targets.params) {
          req.params = RequestValidator.validateData(targets.params, req.params);
        }

        // Validar query parameters
        if (targets.query) {
          req.query = RequestValidator.validateData(targets.query, req.query);
        }

        // Validar body
        if (targets.body) {
          req.body = RequestValidator.validateData(targets.body, req.body);
        }

        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedError = ValidationErrorFormatter.formatZodError(error);
          res.status(400).json(formattedError);
        } else {
          const formattedError = ValidationErrorFormatter.formatGeneralError(error);
          res.status(400).json(formattedError);
        }
      }
    };
  }
}

/**
 * Factory de middlewares de validação específicos
 */
export class ValidationMiddlewareFactory {
  /**
   * Cria middleware para validação apenas do body
   */
  static validateBody<T>(schema: z.ZodSchema<T>) {
    return RequestValidator.create({ body: schema });
  }

  /**
   * Cria middleware para validação apenas dos parâmetros
   */
  static validateParams<T>(schema: z.ZodSchema<T>) {
    return RequestValidator.create({ params: schema });
  }

  /**
   * Cria middleware para validação apenas da query
   */
  static validateQuery<T>(schema: z.ZodSchema<T>) {
    return RequestValidator.create({ query: schema });
  }

  /**
   * Cria middleware para validação completa
   */
  static validateAll<TBody, TParams, TQuery>(
    bodySchema?: z.ZodSchema<TBody>,
    paramsSchema?: z.ZodSchema<TParams>,
    querySchema?: z.ZodSchema<TQuery>
  ) {
    return RequestValidator.create({
      body: bodySchema,
      params: paramsSchema,
      query: querySchema
    });
  }
}

/**
 * Middleware específico para validação de campos opcionais em updates
 */
export class UpdateValidationMiddleware {
  static validateUpdateFields<T extends Record<string, any>>(schema: z.ZodSchema<T>) {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      try {
        // Primeiro valida com o schema padrão
        req.body = schema.parse(req.body);

        // Verifica se pelo menos um campo foi fornecido
        if (Object.keys(req.body).length === 0) {
          res.status(400).json({
            error: 'Nenhum campo para atualizar',
            message: 'Pelo menos um campo deve ser fornecido para atualização'
          });
          return;
        }

        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const formattedError = ValidationErrorFormatter.formatZodError(error);
          res.status(400).json(formattedError);
        } else {
          const formattedError = ValidationErrorFormatter.formatGeneralError(error);
          res.status(400).json(formattedError);
        }
      }
    };
  }
}

/**
 * Utilitários para composição de validações
 * Permite combinar múltiplas validações de forma flexível
 */
export class ValidationComposer {
  /**
   * Compõe múltiplos middlewares de validação
   */
  static compose(...middlewares: Array<(req: Request, res: Response, next: NextFunction) => void>) {
    return middlewares;
  }

  /**
   * Cria um pipeline de validação condicional
   */
  static conditional(
    condition: (req: Request) => boolean,
    middleware: (req: Request, res: Response, next: NextFunction) => void
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (condition(req)) {
        middleware(req, res, next);
      } else {
        next();
      }
    };
  }
}