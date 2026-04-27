import { Request, Response, NextFunction } from "express";
import { productsService } from "../services/products.service.js";
import { CreateProductDto, UpdateProductDto, ListProductsQuery, ProductIdParams } from "../dtos/products.dto.js";
 
export const productsController = {
  getAll: (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = res.locals.query as ListProductsQuery;
      const result = productsService.getAll(query);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },
 
  getById: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as ProductIdParams;
      const result = productsService.getById(id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },
 
  create: (req: Request<{}, {}, CreateProductDto>, res: Response, next: NextFunction) => {
    try {
      const result = productsService.create(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  },
 
  update: (req: Request<{}, {}, UpdateProductDto>, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as ProductIdParams;
      const result = productsService.update(id, req.body);
      res.json(result);
    } catch (e) {
      next(e);
    }
  },
 
  delete: (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as ProductIdParams;
      productsService.delete(id);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },
};