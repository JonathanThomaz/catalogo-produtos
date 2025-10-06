import { z } from "zod";

/**
 * Schema base para validação de produto
 */
export const ProductBaseSchema = z.object({
  title: z
    .string({ message: "Título deve ser uma string" })
    .min(1, "Título não pode estar vazio")
    .max(255, "Título deve ter no máximo 255 caracteres")
    .trim(),

  description: z
    .string({ message: "Descrição deve ser uma string" })
    .min(1, "Descrição não pode estar vazia")
    .trim(),

  price: z
    .number({ message: "Preço deve ser um número" })
    .positive("Preço deve ser um valor positivo")
    .multipleOf(0.01, "Preço deve ter no máximo 2 casas decimais"),
});

/**
 * Schema para criação de produto
 * Estende o schema base com todas as propriedades obrigatórias
 */
export const CreateProductSchema = ProductBaseSchema.strict();

/**
 * Schema para atualização de produto
 * Torna todas as propriedades opcionais, mas mantém as validações quando presentes
 */
export const UpdateProductSchema = ProductBaseSchema.partial().strict();

/**
 * Schema para validação de parâmetros de ID
 * Separado por responsabilidade específica
 */
export const ProductIdSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID deve conter apenas números")
    .transform((val) => parseInt(val))
    .refine((val) => val > 0, "ID deve ser um número positivo"),
});

/**
 * Schema para validação de query parameters (filtros, paginação, etc.)
 * Preparado para futuras extensões
 */
export const ProductQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1))
    .refine((val) => val > 0, "Página deve ser um número positivo"),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10))
    .refine((val) => val > 0 && val <= 100, "Limite deve ser entre 1 e 100"),

  search: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
});

/**
 * Tipos TypeScript derivados dos schemas
 * Garante consistência entre validação e tipagem
 */
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type ProductIdParams = z.infer<typeof ProductIdSchema>;
export type ProductQueryParams = z.infer<typeof ProductQuerySchema>;

/**
 * Utilitário para validar se pelo menos um campo foi fornecido na atualização
 * Evita atualizações vazias
 */
export const validateUpdateHasFields = (data: UpdateProductInput): boolean => {
  return Object.keys(data).length > 0;
};

/**
 * Schema de resposta de erro padronizado
 * Útil para documentação e validação de respostas
 */
export const ErrorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.array(z.string()).optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
