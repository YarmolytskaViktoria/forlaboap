import { IRequest } from "../types/request.types.js";
import { ListRequestsQuery } from "../dtos/requests.dto.js";
import { all, get, run } from "../db/dbClient.js";

export const requestsRepository = {
  getAll: async (query: ListRequestsQuery) => {
    const offset = (query.page - 1) * query.pageSize;
    const conditions: string[] = [];

    if (query.status) conditions.push(`status = '${query.status}'`);
    if (query.userId) conditions.push(`userId = '${query.userId}'`);

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    let orderBy = "ORDER BY createdAt DESC";
    if (query.sortBy) {
      orderBy = `ORDER BY ${query.sortBy} ${query.sortDir.toUpperCase()}`;
    }

    const rows = await all<IRequest>(`
      SELECT id, userId, productId, status, comment, createdAt
      FROM Requests
      ${where}
      ${orderBy}
      LIMIT ${query.pageSize} OFFSET ${offset};
    `);
    const countRow = await get<{ total: number }>(
      `SELECT COUNT(*) as total FROM Requests ${where};`
    );
    return { items: rows, total: countRow?.total ?? 0 };
  },

  getById: async (id: string): Promise<IRequest | undefined> =>
    get<IRequest>(`
      SELECT id, userId, productId, status, comment, createdAt
      FROM Requests WHERE id = '${id}';
    `),

  getAllWithDetails: async () => {
    return await all<{
      id: string;
      status: string;
      comment: string;
      createdAt: string;
      userName: string;
      userEmail: string;
      productName: string;
      licenseType: string;
    }>(`
      SELECT
        r.id,
        r.status,
        r.comment,
        r.createdAt,
        u.name AS userName,
        u.email AS userEmail,
        p.name AS productName,
        p.licenseType
      FROM Requests r
      JOIN Users u ON u.id = r.userId
      JOIN Products p ON p.id = r.productId
      ORDER BY r.createdAt DESC;
    `);
  },

  // Агрегація: кількість запитів по кожному статусу
  getStats: async () => {
    return await all<{ status: string; count: number }>(`
      SELECT status, COUNT(*) as count
      FROM Requests
      GROUP BY status
      ORDER BY count DESC;
    `);
  },

  create: async (request: IRequest): Promise<IRequest> => {
    await run(`
      INSERT INTO Requests (id, userId, productId, status, comment, createdAt)
      VALUES (
        '${request.id}',
        '${request.userId}',
        '${request.productId}',
        '${request.status}',
        '${request.comment}',
        '${request.createdAt}'
      );
    `);
    return request;
  },

  update: async (id: string, updated: IRequest): Promise<IRequest | null> => {
    const result = await run(`
      UPDATE Requests
      SET status = '${updated.status}',
          comment = '${updated.comment ?? ""}'
      WHERE id = '${id}';
    `);
    if (result.changes === 0) return null;
    return updated;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await run(`DELETE FROM Requests WHERE id = '${id}';`);
    return result.changes > 0;
  },
};