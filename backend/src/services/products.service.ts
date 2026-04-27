import { v4 as uuid } from "uuid";
import { productsRepository } from "../repositories/products.repository.js";
import {
  CreateProductDto,
  UpdateProductDto,
  ListProductsQuery,
  ProductViewDto,
} from "../dtos/products.dto.js";
import type { ListResponse } from "../types/common.ts";
import { IProduct } from "../types/products.types.js";
 
const toView = (item: IProduct): ProductViewDto => ({
  id: item.id,
  name: item.name,
  licenseType: item.licenseType,
  userEmail: item.userEmail,
  createdAt: item.createdAt,
});
 
export const productsService = {
  getAll: (query: ListProductsQuery): ListResponse<ProductViewDto> => {
    const { items, total } = productsRepository.getAll(query);
    return {
      items: items.map(toView),
      total,
    };
  },
 
  getById: (id: string): ProductViewDto => {
    const item = productsRepository.getById(id);
    if (!item) {
      throw { status: 404, code: "NOT_FOUND", message: "Product not found" };
    }
    return toView(item);
  },
 
  create: (data: CreateProductDto): ProductViewDto => {
    // Перевірка на дублікат name + licenseType — 409 Conflict
    const existing = productsRepository.findByNameAndLicense(
      data.name,
      data.licenseType
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
      createdAt: new Date().toISOString(),
      comment: data.comment || "",
    };
 
    return toView(productsRepository.create(newProduct));
  },
 
  update: (id: string, data: UpdateProductDto): ProductViewDto => {
    const existing = productsRepository.getById(id);
    if (!existing) {
      throw { status: 404, code: "NOT_FOUND", message: "Product not found" };
    }
 
    // Перевірка конфлікту при зміні name або licenseType
    const newName = data.name ?? existing.name;
    const newLicense = data.licenseType ?? existing.licenseType;
 
    if (newName !== existing.name || newLicense !== existing.licenseType) {
      const duplicate = productsRepository.findByNameAndLicense(newName, newLicense);
      if (duplicate && duplicate.id !== id) {
        throw {
          status: 409,
          code: "CONFLICT",
          message: "Product with this name and license type already exists",
        };
      }
    }
 
    const updated = productsRepository.update(id, { ...existing, ...data });
    return toView(updated!);
  },
 
  delete: (id: string): void => {
    const success = productsRepository.delete(id);
    if (!success) {
      throw { status: 404, code: "NOT_FOUND", message: "Product not found" };
    }
  },
};