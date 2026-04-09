import { Request, Response, NextFunction } from 'express';
import { productsService } from '../services/products.service.js';
import { ListProductsQuery, CreateProductDto, UpdateProductDto } from '../dtos/products.dto.js';

export const productsController = {
  // GET /api/products
  getAll: (req: Request<any, any, any, ListProductsQuery>, res: Response, next: NextFunction) => {
    try {
      const result = productsService.getAll(req.query);
      res.json(result); // повертає { items, total }
    } catch (e) {
      next(e);
    }
  },

  // GET /api/products/:id
  getById: (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const result = productsService.getById(req.params.id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  // POST /api/products
  create: (req: Request<any, any, CreateProductDto>, res: Response, next: NextFunction) => {
    try {
      const result = productsService.create(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  },

  // PUT /api/products/:id
  update: (req: Request<{ id: string }, any, UpdateProductDto>, res: Response, next: NextFunction) => {
    try {
      const result = productsService.update(req.params.id, req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  // DELETE /api/products/:id
  delete: (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      productsService.delete(req.params.id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
};
