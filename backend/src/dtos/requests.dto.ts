import { z } from "zod";
import type { ListResponse } from "../types/common.ts";

export const createRequestBodySchema = z.object({
  userId: z.string().uuid("userId має бути у форматі UUID"),
  productId: z.string().uuid("productId має бути у форматі UUID"),
  status: z.enum(["pending", "approved", "rejected"], {
    message: "Неправильний статус",
  }).default("pending"),
  comment: z.string().optional().default(""),
});

export const updateRequestBodySchema = createRequestBodySchema.partial();

export const requestIdParamsSchema = z.object({
  id: z.string().uuid("ID має бути у форматі UUID"),
});

export const listRequestsQuerySchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  userId: z.string().uuid().optional(),
  sortBy: z.enum(["createdAt", "status"]).optional(),
  sortDir: z.enum(["asc", "desc"]).default("asc"),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(50).default(10),
});

export type CreateRequestDto = z.infer<typeof createRequestBodySchema>;
export type UpdateRequestDto = z.infer<typeof updateRequestBodySchema>;
export type RequestIdParams = z.infer<typeof requestIdParamsSchema>;
export type ListRequestsQuery = z.infer<typeof listRequestsQuerySchema>;

export interface RequestViewDto {
  id: string;
  userId: string;
  productId: string;
  status: string;
  comment: string;
  createdAt: string;
}

export type { ListResponse };