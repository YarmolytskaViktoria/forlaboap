import { v4 as uuid } from "uuid";
import { productsRepository } from "../repositories/products.repository.js";
import {
  CreateProductDto,
  UpdateProductDto,
  ListProductsQuery,
  ProductViewDto,
} from "../dtos/products.dto.js";
import type { ListResponse } from "../types/common.js";
import { IProduct } from "../types/products.types.js";

const toView = (item: IProduct): ProductViewDto => ({
  id: item.id,
  name: item.name,
  licenseType: item.licenseType,
  userEmail: item.userEmail,
  ownerUserId: item.ownerUserId,
  createdAt: item.createdAt,
  comment: item.comment,
});

export const productsService = {
  getAll: async (
    query: ListProductsQuery,
    currentUserId: string
  ): Promise<ListResponse<ProductViewDto>> => {
    const { items, total } = await productsRepository.getAll(query, currentUserId);
    return { items: items.map(toView), total };
  },

  getById: async (
    id: string,
    currentUserId: string
  ): Promise<ProductViewDto> => {
    const item = await productsRepository.getById(id, currentUserId);

    if (!item) {
      throw { status: 404, code: "NOT_FOUND", message: "Product not found" };
    }

    return toView(item);
  },

  getStats: async (
    currentUserId: string
  ): Promise<ListResponse<{ licenseType: string; count: number }>> => {
    const items = await productsRepository.getStats(currentUserId);
    return { items, total: items.length };
  },

  search: async (q: string, currentUserId: string) => {
    const items = await productsRepository.search(q, currentUserId);
    return { items: items.map(toView), total: items.length };
  },

  create: async (
    data: CreateProductDto,
    currentUserId: string
  ): Promise<ProductViewDto> => {
    const existing = await productsRepository.findByNameAndLicense(
      data.name,
      data.licenseType,
      currentUserId
    );

    if (existing) {
      throw {
        status: 409,
        code: "CONFLICT",
        message: "Product with this name and license type already exists",
      };
    }

    const newProduct: IProduct = {
      id: uuid(),
      name: data.name,
      licenseType: data.licenseType,
      userEmail: data.userEmail,
      ownerUserId: currentUserId,
      createdAt: new Date().toISOString(),
      comment: data.comment || "",
    };

    return toView(await productsRepository.create(newProduct));
  },

  update: async (
    id: string,
    data: UpdateProductDto,
    currentUserId: string
  ): Promise<ProductViewDto> => {
    const existing = await productsRepository.getById(id, currentUserId);

    if (!existing) {
      throw { status: 404, code: "NOT_FOUND", message: "Product not found" };
    }

    const newName = data.name ?? existing.name;
    const newLicense = data.licenseType ?? existing.licenseType;

    if (newName !== existing.name || newLicense !== existing.licenseType) {
      const duplicate = await productsRepository.findByNameAndLicense(
        newName,
        newLicense,
        currentUserId
      );

      if (duplicate && duplicate.id !== id) {
        throw {
          status: 409,
          code: "CONFLICT",
          message: "Product with this name and license type already exists",
        };
      }
    }

    const updated = await productsRepository.update(id, currentUserId, {
      ...existing,
      ...data,
      comment: data.comment ?? existing.comment,
    });

    return toView(updated!);
  },

  delete: async (id: string, currentUserId: string): Promise<void> => {
    const deleted = await productsRepository.delete(id, currentUserId);

    if (!deleted) {
      throw { status: 404, code: "NOT_FOUND", message: "Product not found" };
    }
  },
};