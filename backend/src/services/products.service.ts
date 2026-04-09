import { v4 as uuid } from "uuid";
import { productsRepository } from "../repositories/products.repository.js";
import { 
  CreateProductDto, 
  UpdateProductDto, 
  ListProductsQuery, 
  ProductViewDto, 
  ListResponse 
} from "../dtos/products.dto.js";
import { IProduct } from "../types/products.types.js";

export const productsService = {
  // Уніфікована відповідь ListResponse
  getAll: (query: ListProductsQuery): ListResponse<ProductViewDto> => {
    const items = productsRepository.getAll(query);
    return {
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        licenseType: item.licenseType,
        userEmail: item.userEmail,
        createdAt: item.createdAt
      })),
      total: items.length
    };
  },

  getById: (id: string): ProductViewDto => {
    const item = productsRepository.getById(id);
    if (!item) throw { status: 404, code: "NOT_FOUND", message: "Product not found" };
    
    return item; // Вже містить потрібні поля
  },

  create: (data: CreateProductDto): ProductViewDto => {
    const newProduct: IProduct = {
      id: uuid(),
      name: data.name,
      licenseType: data.licenseType,
      userEmail: data.userEmail,
      createdAt: new Date().toISOString(),
      comment: data.comment || ""
    };

    const saved = productsRepository.create(newProduct);
    return saved;
  },

  update: (id: string, data: UpdateProductDto): ProductViewDto => {
    const existing = productsRepository.getById(id);
    if (!existing) throw { status: 404, code: "NOT_FOUND", message: "Product not found" };

    const updated = productsRepository.update(id, {
      ...existing,
      ...data, // Накладаємо оновлені поля поверх старих
    });

    return updated!;
  },

  delete: (id: string): void => {
    const success = productsRepository.delete(id);
    if (!success) throw { status: 404, code: "NOT_FOUND", message: "Product not found" };
  }
};