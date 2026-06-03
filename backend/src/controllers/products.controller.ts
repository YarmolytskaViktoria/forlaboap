import { Request, Response, NextFunction } from "express";
import { productsService } from "../services/products.service.js";
import {
  CreateProductDto,
  UpdateProductDto,
  ListProductsQuery,
  ProductIdParams,
} from "../dtos/products.dto.js";

export const productsController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = res.locals.query as ListProductsQuery;
      const currentUserId = res.locals.currentUserId as string;
      res.json(await productsService.getAll(query, currentUserId));
    } catch (e) {
      next(e);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as ProductIdParams;
      const currentUserId = res.locals.currentUserId as string;
      res.json(await productsService.getById(id, currentUserId));
    } catch (e) {
      next(e);
    }
  },

  getStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUserId = res.locals.currentUserId as string;
      res.json(await productsService.getStats(currentUserId));
    } catch (e) {
      next(e);
    }
  },

  search: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const q = String(req.query.q ?? "");
      const currentUserId = res.locals.currentUserId as string;
      res.json(await productsService.search(q, currentUserId));
    } catch (e) {
      next(e);
    }
  },

  create: async (
    req: Request<{}, {}, CreateProductDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const currentUserId = res.locals.currentUserId as string;
      res.status(201).json(await productsService.create(req.body, currentUserId));
    } catch (e) {
      next(e);
    }
  },

  update: async (
    req: Request<{}, {}, UpdateProductDto>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = res.locals.params as ProductIdParams;
      const currentUserId = res.locals.currentUserId as string;
      res.json(await productsService.update(id, req.body, currentUserId));
    } catch (e) {
      next(e);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as ProductIdParams;
      const currentUserId = res.locals.currentUserId as string;
      await productsService.delete(id, currentUserId);
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },
};