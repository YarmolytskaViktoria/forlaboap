import { IUser } from "../types/user.types.js";

const users: IUser[] = [];

export const usersRepository = {
  getAll: (): IUser[] => users,

  getById: (id: string): IUser | undefined => 
    users.find(u => u.id === id),

  create: (user: IUser): IUser => {
    users.push(user);
    return user;
  },

  update: (id: string, updated: IUser): IUser | null => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    users[index] = updated;
    return updated;
  },

  delete: (id: string): boolean => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  }
};