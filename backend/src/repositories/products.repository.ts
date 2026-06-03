import { IProduct } from "../types/products.types.js";
import { ListProductsQuery } from "../dtos/products.dto.js";
import { all, get, run } from "../db/dbClient.js";

const sortColumns: Record<string, string> = {
  name: "name",
  createdAt: "createdAt",
  licenseType: "licenseType",
};

export const productsRepository = {
  getAll: async (query: ListProductsQuery, ownerUserId: string) => {
    const offset = (query.page - 1) * query.pageSize;
    const conditions = ["ownerUserId = ?"];   // Найменші привілеї для запобігання IDOR
    const params: Array<string | number> = [ownerUserId];

    if (query.licenseType) {
      conditions.push("licenseType = ?");
      params.push(query.licenseType);
    }

    const where = `WHERE ${conditions.join(" AND ")}`;
    const sortBy = query.sortBy ? sortColumns[query.sortBy] : "createdAt";
    const sortDir = query.sortDir === "asc" ? "ASC" : "DESC";

    const rows = await all<IProduct>(
      `
      SELECT id, name, licenseType, userEmail, ownerUserId, comment, createdAt
      FROM Products
      ${where}
      ORDER BY ${sortBy} COLLATE NOCASE ${sortDir}
      LIMIT ? OFFSET ?;
      `,
      [...params, query.pageSize, offset]
    );

    const countRow = await get<{ total: number }>(
      `SELECT COUNT(*) as total FROM Products ${where};`,
      params
    );

    return { items: rows, total: countRow?.total ?? 0 };
  },

  // --- IDOR ---
  getById: async (
    id: string,
    ownerUserId: string
  ): Promise<IProduct | undefined> =>
    get<IProduct>(
      `
      SELECT id, name, licenseType, userEmail, ownerUserId, comment, createdAt
      FROM Products
      WHERE id = ? AND ownerUserId = ?;
      `,
      [id, ownerUserId]
    ),

  findByNameAndLicense: async (
    name: string,
    licenseType: string,
    ownerUserId: string
  ): Promise<IProduct | undefined> =>
    get<IProduct>(
      `
      SELECT id, name, licenseType, userEmail, ownerUserId, comment, createdAt
      FROM Products
      WHERE name = ? AND licenseType = ? AND ownerUserId = ?;
      `,
      [name, licenseType, ownerUserId]
    ),

  getStats: async (ownerUserId: string) => {
    return await all<{ licenseType: string; count: number }>(
      `
      SELECT licenseType, COUNT(*) as count
      FROM Products
      WHERE ownerUserId = ?
      GROUP BY licenseType
      ORDER BY count DESC;
      `,
      [ownerUserId]
    );
  },

  // --- SQLi ---
  search: async (q: string, ownerUserId: string) => {
    return await all<IProduct>(
      `
      SELECT id, name, licenseType, userEmail, ownerUserId, comment, createdAt
      FROM Products
      WHERE ownerUserId = ? AND name LIKE ?
      ORDER BY name ASC
      LIMIT 20;
      `,
      [ownerUserId, `%${q}%`]
    );
  },

  create: async (product: IProduct): Promise<IProduct> => {
    await run(
      `
      INSERT INTO Products (id, name, licenseType, userEmail, ownerUserId, comment, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      [
        product.id,
        product.name,
        product.licenseType,
        product.userEmail,
        product.ownerUserId,
        product.comment,
        product.createdAt,
      ]
    );

    return product;
  },

  update: async (
    id: string,
    ownerUserId: string,
    updated: IProduct
  ): Promise<IProduct | null> => {
    const result = await run(
      `
      UPDATE Products
      SET name = ?,
          licenseType = ?,
          userEmail = ?,
          comment = ?
      WHERE id = ? AND ownerUserId = ?;
      `,
      [
        updated.name,
        updated.licenseType,
        updated.userEmail,
        updated.comment,
        id,
        ownerUserId,
      ]
    );

    if (result.changes === 0) return null;
    return updated;
  },

  delete: async (id: string, ownerUserId: string): Promise<boolean> => {
    const result = await run(
      `DELETE FROM Products WHERE id = ? AND ownerUserId = ?;`,
      [id, ownerUserId]
    );

    return result.changes > 0;
  },
};