import { Request, Response, NextFunction } from "express";
import { productsService } from "../services/products.service.js";
import { CreateProductDto, UpdateProductDto, ListProductsQuery, ProductIdParams } from "../dtos/products.dto.js";

export const productsController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = res.locals.query as ListProductsQuery;
      res.json(await productsService.getAll(query));
    } catch (e) { next(e); }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as ProductIdParams;
      res.json(await productsService.getById(id));
    } catch (e) { next(e); }
  },

  // Агрегація: кількість продуктів по типу ліцензії
  getStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await productsService.getStats());
    } catch (e) { next(e); }
  },

  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "");
      res.json(await productsService.search(q));
    } catch (e) { next(e); }
  },

  create: async (req: Request<{}, {}, CreateProductDto>, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await productsService.create(req.body));
    } catch (e) { next(e); }
  },

  update: async (req: Request<{}, {}, UpdateProductDto>, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as ProductIdParams;
      res.json(await productsService.update(id, req.body));
    } catch (e) { next(e); }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as ProductIdParams;
      await productsService.delete(id);
      res.status(204).send();
    } catch (e) { next(e); }
  },
};