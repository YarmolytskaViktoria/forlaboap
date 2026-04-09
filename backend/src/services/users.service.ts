import { v4 as uuid } from "uuid";
import { usersRepository } from "../repositories/users.repository.js";
import { CreateUserDto, UpdateUserDto, UserViewDto } from "../dtos/users.dto.js";
import { IUser } from "../types/user.types.js";

export const usersService = {
  getAll: (): UserViewDto[] => {
    return usersRepository.getAll().map(user => ({
      id: user.id,
      name: user.name,
      email: user.email
      // Пароль ігнорується
    }));
  },

  getById: (id: string): UserViewDto => {
    const user = usersRepository.getById(id);
    if (!user) throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    
    return { id: user.id, name: user.name, email: user.email };
  },

  create: (data: CreateUserDto): UserViewDto => {
    const newUser: IUser = {
      id: uuid(),
      ...data
    };
    
    const saved = usersRepository.create(newUser);
    return { id: saved.id, name: saved.name, email: saved.email };
  },

  update: (id: string, data: UpdateUserDto): UserViewDto => {
    const user = usersRepository.getById(id);
    if (!user) throw { status: 404, code: "NOT_FOUND", message: "User not found" };

    const updated = usersRepository.update(id, { ...user, ...data });
    return { id: updated!.id, name: updated!.name, email: updated!.email };
  },

  delete: (id: string): void => {
    if (!usersRepository.delete(id)) {
      throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    }
  }
};
