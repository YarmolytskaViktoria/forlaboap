import { IProduct } from "../types/products.types.js";
import { ListProductsQuery } from "../dtos/products.dto.js";
import { all, get, run } from "../db/dbClient.js";

export const productsRepository = {
  getAll: async (query: ListProductsQuery) => {
    const offset = (query.page - 1) * query.pageSize;
    let where = "";
    if (query.licenseType) {
      where = `WHERE licenseType = '${query.licenseType}'`;
    }

    let orderBy = "ORDER BY createdAt DESC";
    if (query.sortBy) {
      orderBy = `ORDER BY ${query.sortBy} COLLATE NOCASE ${query.sortDir.toUpperCase()}`;
    }

    const rows = await all<IProduct>(`
      SELECT id, name, licenseType, userEmail, comment, createdAt
      FROM Products
      ${where}
      ${orderBy}
      LIMIT ${query.pageSize} OFFSET ${offset};
    `);
    const countRow = await get<{ total: number }>(
      `SELECT COUNT(*) as total FROM Products ${where};`
    );
    return { items: rows, total: countRow?.total ?? 0 };
  },

  getById: async (id: string): Promise<IProduct | undefined> =>
    get<IProduct>(`
      SELECT id, name, licenseType, userEmail, comment, createdAt
      FROM Products WHERE id = '${id}';
    `),

  findByNameAndLicense: async (name: string, licenseType: string): Promise<IProduct | undefined> =>
    get<IProduct>(`
      SELECT id, name, licenseType, userEmail, comment, createdAt
      FROM Products
      WHERE name = '${name}' AND licenseType = '${licenseType}';
    `),

  // Агрегація: кількість продуктів по типу ліцензії
  getStats: async () => {
    return await all<{ licenseType: string; count: number }>(`
      SELECT licenseType, COUNT(*) as count
      FROM Products
      GROUP BY licenseType
      ORDER BY count DESC;
    `);
  },

  search: async (q: string) => {
    const sql = `
      SELECT id, name, licenseType, userEmail, comment, createdAt
      FROM Products
      WHERE name LIKE '%${q}%'
      ORDER BY name ASC
      LIMIT 20;
    `;
    return await all<IProduct>(sql);
  },

  create: async (product: IProduct): Promise<IProduct> => {
    await run(`
      INSERT INTO Products (id, name, licenseType, userEmail, comment, createdAt)
      VALUES (
        '${product.id}',
        '${product.name}',
        '${product.licenseType}',
        '${product.userEmail}',
        '${product.comment}',
        '${product.createdAt}'
      );
    `);
    return product;
  },

  update: async (id: string, updated: IProduct): Promise<IProduct | null> => {
    const result = await run(`
      UPDATE Products
      SET name = '${updated.name}',
          licenseType = '${updated.licenseType}',
          userEmail = '${updated.userEmail}',
          comment = '${updated.comment ?? ""}'
      WHERE id = '${id}';
    `);
    if (result.changes === 0) return null;
    return updated;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await run(`DELETE FROM Products WHERE id = '${id}';`);
    return result.changes > 0;
  },
};