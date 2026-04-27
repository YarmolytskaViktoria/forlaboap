import { IProduct } from "../types/products.types.js";
import { ListProductsQuery } from "../dtos/products.dto.js";
 
const products: IProduct[] = [];
 
export const productsRepository = {
  getAll: (query: ListProductsQuery) => {
    let result = [...products];
 
    if (query.licenseType) {
      result = result.filter((p) => p.licenseType === query.licenseType);
    }
 
    if (query.sortBy) {
      const field = query.sortBy;
      const dir = query.sortDir === "desc" ? -1 : 1;
 
      result.sort((a, b) => {
        const av =
          field === "createdAt"
            ? new Date(a[field]!).getTime()
            : (a[field] as string);
        const bv =
          field === "createdAt"
            ? new Date(b[field]!).getTime()
            : (b[field] as string);
 
        if (av > bv) return 1 * dir;
        if (av < bv) return -1 * dir;
        return 0;
      });
    }
 
    const start = (query.page - 1) * query.pageSize;
    const paginated = result.slice(start, start + query.pageSize);
 
    return {
      items: paginated,
      total: result.length,
    };
  },
 
  getById: (id: string): IProduct | undefined =>
    products.find((p) => p.id === id),
 
  findByNameAndLicense: (name: string, licenseType: string): IProduct | undefined =>
    products.find(
      (p) =>
        p.name.toLowerCase() === name.toLowerCase() &&
        p.licenseType === licenseType
    ),
 
  create: (product: IProduct): IProduct => {
    products.push(product);
    return product;
  },
 
  update: (id: string, updated: IProduct): IProduct | null => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = updated;
    return updated;
  },
 
  delete: (id: string): boolean => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },
};