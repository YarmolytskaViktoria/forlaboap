import { z } from "zod";

export const createProductBodySchema = z.object({
  name: z.string().min(3, "Назва має бути не менше 3 символів"),
  licenseType: z.enum(["Free", "Academic", "Commercial"], {
    message: "Неправильний тип ліцензії",
  }),
  userEmail: z.email("Некоректний формат email"),
  comment: z.string().optional().default(""),
});

export const updateProductBodySchema = createProductBodySchema.partial();

export const productIdParamsSchema = z.object({
  id: z.string().uuid("ID має бути у форматі UUID"),
});

export const listProductsQuerySchema = z.object({
  licenseType: z.enum(["Free", "Academic", "Commercial"]).optional(),
  sortBy: z.enum(["name", "createdAt"]).optional(),
  sortDir: z.enum(["asc", "desc"]).default("asc"),
});

export type CreateProductDto = z.infer<typeof createProductBodySchema>;
export type UpdateProductDto = z.infer<typeof updateProductBodySchema>;
export type ProductIdParams = z.infer<typeof productIdParamsSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;

export interface ProductViewDto {
  id: string;
  name: string;
  licenseType: string;
  userEmail: string;
  createdAt: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
}