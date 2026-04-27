import { Request, Response, NextFunction } from "express";
import { usersService } from "../services/users.service.js";
import { CreateUserDto, UpdateUserDto, ListUsersQuery, UserIdParams } from "../dtos/users.dto.js";
 
export const usersController = {
  getAll: (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = res.locals.query as ListUsersQuery;
      const result = usersService.getAll(query);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },
 
  getById: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as UserIdParams;
      const user = usersService.getById(id);
      res.json(user);
    } catch (e) {
      next(e);
    }
  },
 
  create: (req: Request<{}, {}, CreateUserDto>, res: Response, next: NextFunction) => {
    try {
      const user = usersService.create(req.body);
      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  },
 
  update: (req: Request<{}, {}, UpdateUserDto>, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as UserIdParams;
      const user = usersService.update(id, req.body);
      res.json(user);
    } catch (e) {
      next(e);
    }
  },
 
  delete: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as UserIdParams;
      usersService.delete(id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },
};