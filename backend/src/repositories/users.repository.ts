import { IUser } from "../types/user.types.js";
import { ListUsersQuery } from "../dtos/users.dto.js";
 
const users: IUser[] = [];
 
export const usersRepository = {
  getAll: (query: ListUsersQuery) => {
    const start = (query.page - 1) * query.pageSize;
    const paginated = users.slice(start, start + query.pageSize);
 
    return {
      items: paginated,
      total: users.length,
    };
  },
 
  getById: (id: string): IUser | undefined =>
    users.find((u) => u.id === id),
 
  findByEmail: (email: string): IUser | undefined =>
    users.find((u) => u.email === email),
 
  create: (user: IUser): IUser => {
    users.push(user);
    return user;
  },
 
  update: (id: string, updated: IUser): IUser | null => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    users[index] = updated;
    return updated;
  },
 
  delete: (id: string): boolean => {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  },
};