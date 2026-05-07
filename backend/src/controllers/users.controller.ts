import { Request, Response, NextFunction } from "express";
import { usersService } from "../services/users.service.js";
import { CreateUserDto, UpdateUserDto, ListUsersQuery, UserIdParams } from "../dtos/users.dto.js";

export const usersController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = res.locals.query as ListUsersQuery;
      res.json(await usersService.getAll(query));
    } catch (e) { next(e); }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as UserIdParams;
      res.json(await usersService.getById(id));
    } catch (e) { next(e); }
  },

  getWithStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await usersService.getWithStats();
      res.json({ data: result });
    } catch (e) { next(e); }
  },

  create: async (req: Request<{}, {}, CreateUserDto>, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await usersService.create(req.body));
    } catch (e) { next(e); }
  },

  update: async (req: Request<{}, {}, UpdateUserDto>, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as UserIdParams;
      res.json(await usersService.update(id, req.body));
    } catch (e) { next(e); }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as UserIdParams;
      await usersService.delete(id);
      res.status(204).send();
    } catch (e) { next(e); }
  },
};