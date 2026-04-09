import { Request, Response, NextFunction } from 'express';
import { usersService } from '../services/users.service.js';
import { CreateUserDto, UpdateUserDto } from '../dtos/users.dto.js';

export const usersController = {
  // GET /api/users
  getAll: (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = usersService.getAll();
      res.status(200).json({
        items,
        total: items.length,
      });
    } catch (e) {
      next(e);
    }
  },

  // GET /api/users/:id
  getById: (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const user = usersService.getById(req.params.id);
      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  },

  // POST /api/users
  create: (req: Request<any, any, CreateUserDto>, res: Response, next: NextFunction) => {
    try {
      const user = usersService.create(req.body);
      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  },

  // PUT /api/users/:id
  update: (req: Request<{ id: string }, any, UpdateUserDto>, res: Response, next: NextFunction) => {
    try {
      const user = usersService.update(req.params.id, req.body);
      res.status(200).json(user);
    } catch (e) {
      next(e);
    }
  },

  // DELETE /api/users/:id
  delete: (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      usersService.delete(req.params.id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
};