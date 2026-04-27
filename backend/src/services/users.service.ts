import { v4 as uuid } from "uuid";
import { createHash } from "crypto";
import { usersRepository } from "../repositories/users.repository.js";
import {
  CreateUserDto,
  UpdateUserDto,
  UserViewDto,
  ListUsersQuery,
} from "../dtos/users.dto.js";
import type { ListResponse } from "../types/common.js";
import { IUser } from "../types/user.types.js";
 
// Хешування через вбудований Node.js crypto — без зовнішніх залежностей
const hashPassword = (password: string): string =>
  createHash("sha256").update(password).digest("hex");
 
const toView = (user: IUser): UserViewDto => ({
  id: user.id,
  name: user.name,
  email: user.email,
});
 
export const usersService = {
  getAll: (query: ListUsersQuery): ListResponse<UserViewDto> => {
    const { items, total } = usersRepository.getAll(query);
    return {
      items: items.map(toView),
      total,
    };
  },
 
  getById: (id: string): UserViewDto => {
    const user = usersRepository.getById(id);
    if (!user) {
      throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    }
    return toView(user);
  },
 
  create: (data: CreateUserDto): UserViewDto => {
    const existing = usersRepository.findByEmail(data.email);
    if (existing) {
      throw {
        status: 409,
        code: "CONFLICT",
        message: "User with this email already exists",
      };
    }
 
    const newUser: IUser = {
      id: uuid(),
      name: data.name,
      email: data.email,
      password: hashPassword(data.password),
    };
 
    return toView(usersRepository.create(newUser));
  },
 
  update: (id: string, data: UpdateUserDto): UserViewDto => {
    const user = usersRepository.getById(id);
    if (!user) {
      throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    }
 
    if (data.email && data.email !== user.email) {
      const emailTaken = usersRepository.findByEmail(data.email);
      if (emailTaken) {
        throw {
          status: 409,
          code: "CONFLICT",
          message: "User with this email already exists",
        };
      }
    }
 
    const updated = usersRepository.update(id, { ...user, ...data });
    return toView(updated!);
  },
 
  delete: (id: string): void => {
    if (!usersRepository.delete(id)) {
      throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    }
  },
};
