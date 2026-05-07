import { IUser } from "../types/user.types.js";
import { ListUsersQuery } from "../dtos/users.dto.js";
import { all, get, run } from "../db/dbClient.js";

export const usersRepository = {
  getAll: async (query: ListUsersQuery) => {
    const offset = (query.page - 1) * query.pageSize;
    const rows = await all<IUser>(`
      SELECT id, name, email, password, createdAt
      FROM Users
      ORDER BY createdAt DESC
      LIMIT ${query.pageSize} OFFSET ${offset};
    `);
    const countRow = await get<{ total: number }>(
      "SELECT COUNT(*) as total FROM Users;"
    );
    return { items: rows, total: countRow?.total ?? 0 };
  },

  getById: async (id: string): Promise<IUser | undefined> =>
    get<IUser>(`SELECT id, name, email, password, createdAt FROM Users WHERE id = '${id}';`),

  findByEmail: async (email: string): Promise<IUser | undefined> =>
    get<IUser>(`SELECT id, name, email, password, createdAt FROM Users WHERE email = '${email}';`),

  getWithStats: async () => {
    return await all<{
      id: string;
      name: string;
      email: string;
      createdAt: string;
      requestsCount: number;
    }>(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.createdAt,
        COUNT(r.id) AS requestsCount
      FROM Users u
      LEFT JOIN Requests r ON r.userId = u.id
      GROUP BY u.id
      ORDER BY requestsCount DESC;
    `);
  },

  create: async (user: IUser): Promise<IUser> => {
    await run(`
      INSERT INTO Users (id, name, email, password, createdAt)
      VALUES ('${user.id}', '${user.name}', '${user.email}', '${user.password}', '${user.createdAt}');
    `);
    return user;
  },

  update: async (id: string, updated: IUser): Promise<IUser | null> => {
    const result = await run(`
      UPDATE Users
      SET name = '${updated.name}', email = '${updated.email}'
      WHERE id = '${id}';
    `);
    if (result.changes === 0) return null;
    return updated;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await run(`DELETE FROM Users WHERE id = '${id}';`);
    return result.changes > 0;
  },
};