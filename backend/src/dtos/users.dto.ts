import { z } from "zod";

export const createUserBodySchema = z.object({
  name: z.string().min(2, "Ім'я занадто коротке"),
  email: z.email("Невірний формат email"),
  password: z.string().min(6, "Пароль має бути мін. 6 символів"),
});

export const updateUserBodySchema = createUserBodySchema.omit({ password: true }).partial();

export const userIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CreateUserDto = z.infer<typeof createUserBodySchema>;
export type UpdateUserDto = z.infer<typeof updateUserBodySchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;

export interface UserViewDto {
  id: string;
  name: string;
  email: string;
}