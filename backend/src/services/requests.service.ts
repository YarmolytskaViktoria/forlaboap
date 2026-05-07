import { v4 as uuid } from "uuid";
import { requestsRepository } from "../repositories/requests.repository.js";
import {
  CreateRequestDto,
  UpdateRequestDto,
  ListRequestsQuery,
  RequestViewDto,
} from "../dtos/requests.dto.js";
import type { ListResponse } from "../types/common.js";
import { IRequest } from "../types/request.types.js";

const toView = (item: IRequest): RequestViewDto => ({
  id: item.id,
  userId: item.userId,
  productId: item.productId,
  status: item.status,
  comment: item.comment,
  createdAt: item.createdAt,
});

export const requestsService = {
  getAll: async (query: ListRequestsQuery): Promise<ListResponse<RequestViewDto>> => {
    const { items, total } = await requestsRepository.getAll(query);
    return { items: items.map(toView), total };
  },

  getById: async (id: string): Promise<RequestViewDto> => {
    const item = await requestsRepository.getById(id);
    if (!item) throw { status: 404, code: "NOT_FOUND", message: "Request not found" };
    return toView(item);
  },

  getAllWithDetails: async () => {
    return await requestsRepository.getAllWithDetails();
  },

  getStats: async (): Promise<ListResponse<{ status: string; count: number }>> => {
    const items = await requestsRepository.getStats();
    return { items, total: items.length };
  },

  create: async (data: CreateRequestDto): Promise<RequestViewDto> => {
    const newRequest: IRequest = {
      id: uuid(),
      userId: data.userId,
      productId: data.productId,
      status: data.status,
      comment: data.comment,
      createdAt: new Date().toISOString(),
    };
    return toView(await requestsRepository.create(newRequest));
  },

  update: async (id: string, data: UpdateRequestDto): Promise<RequestViewDto> => {
    const existing = await requestsRepository.getById(id);
    if (!existing) throw { status: 404, code: "NOT_FOUND", message: "Request not found" };
    const updated = await requestsRepository.update(id, { ...existing, ...data });
    return toView(updated!);
  },

  delete: async (id: string): Promise<void> => {
    if (!await requestsRepository.delete(id)) {
      throw { status: 404, code: "NOT_FOUND", message: "Request not found" };
    }
  },
};