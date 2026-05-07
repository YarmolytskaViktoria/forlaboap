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

const hashPassword = (password: string): string =>
  createHash("sha256").update(password).digest("hex");

const toView = (user: IUser): UserViewDto => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const usersService = {
  getAll: async (query: ListUsersQuery): Promise<ListResponse<UserViewDto>> => {
    const { items, total } = await usersRepository.getAll(query);
    return { items: items.map(toView), total };
  },

  getById: async (id: string): Promise<UserViewDto> => {
    const user = await usersRepository.getById(id);
    if (!user) throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    return toView(user);
  },

  getWithStats: async () => {
    return await usersRepository.getWithStats();
  },

  create: async (data: CreateUserDto): Promise<UserViewDto> => {
    const existing = await usersRepository.findByEmail(data.email);
    if (existing) throw { status: 409, code: "CONFLICT", message: "User with this email already exists" };

    const newUser: IUser = {
      id: uuid(),
      name: data.name,
      email: data.email,
      password: hashPassword(data.password),
      createdAt: new Date().toISOString(),
    };
    return toView(await usersRepository.create(newUser));
  },

  update: async (id: string, data: UpdateUserDto): Promise<UserViewDto> => {
    const user = await usersRepository.getById(id);
    if (!user) throw { status: 404, code: "NOT_FOUND", message: "User not found" };

    if (data.email && data.email !== user.email) {
      const emailTaken = await usersRepository.findByEmail(data.email);
      if (emailTaken) throw { status: 409, code: "CONFLICT", message: "User with this email already exists" };
    }

    const updated = await usersRepository.update(id, { ...user, ...data });
    return toView(updated!);
  },

  delete: async (id: string): Promise<void> => {
    if (!await usersRepository.delete(id)) {
      throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    }
  },
};
