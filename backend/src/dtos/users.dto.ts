import { z } from "zod";
import type { ListResponse } from "../types/common.ts";
 
export const createUserBodySchema = z.object({
  name: z.string().min(2, "Ім'я занадто коротке"),
  email: z.string().email("Невірний формат email"),
  password: z.string().min(6, "Пароль має бути мін. 6 символів"),
});
 
export const updateUserBodySchema = createUserBodySchema
  .omit({ password: true })
  .partial();
 
export const userIdParamsSchema = z.object({
  id: z.string().uuid(),
});
 
export const listUsersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(10),
});
 
export type CreateUserDto = z.infer<typeof createUserBodySchema>;
export type UpdateUserDto = z.infer<typeof updateUserBodySchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
 
export interface UserViewDto {
  id: string;
  name: string;
  email: string;
}
 
export type { ListResponse };