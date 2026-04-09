import { IProduct } from "../types/products.types.js"; 
import { ListProductsQuery } from "../dtos/products.dto.js";

const products: IProduct[] = [];

export const productsRepository = {
  // Додаємо підтримку фільтрації та сортування
  getAll: (query: ListProductsQuery) => {
    let result = [...products];

    // 5.1. Фільтрація за типом ліцензії
    if (query.licenseType) {
      result = result.filter(p => p.licenseType === query.licenseType);
    }

    // 5.3. Сортування
    if (query.sortBy) {
      const field = query.sortBy;
      const dir = query.sortDir === "desc" ? -1 : 1;
      
      result.sort((a, b) => {
        if (a[field]! > b[field]!) return 1 * dir;
        if (a[field]! < b[field]!) return -1 * dir;
        return 0;
      });
    }

    return result;
  },

  getById: (id: string): IProduct | undefined => 
    products.find(p => p.id === id),

  create: (product: IProduct): IProduct => {
    products.push(product);
    return product;
  },

  update: (id: string, updated: IProduct): IProduct | null => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = updated;
    return updated;
  },

  delete: (id: string): boolean => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  }
};