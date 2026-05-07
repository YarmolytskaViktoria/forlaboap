import { Request, Response, NextFunction } from "express";
import { requestsService } from "../services/requests.service.js";
import {
  CreateRequestDto,
  UpdateRequestDto,
  ListRequestsQuery,
  RequestIdParams,
} from "../dtos/requests.dto.js";

export const requestsController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = res.locals.query as ListRequestsQuery;
      res.json(await requestsService.getAll(query));
    } catch (e) { next(e); }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as RequestIdParams;
      res.json(await requestsService.getById(id));
    } catch (e) { next(e); }
  },

  getWithDetails: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await requestsService.getAllWithDetails();
      res.json({ data: result });
    } catch (e) { next(e); }
  },

  // Агрегація: кількість запитів по кожному статусу
  getStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await requestsService.getStats());
    } catch (e) { next(e); }
  },

  create: async (req: Request<{}, {}, CreateRequestDto>, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await requestsService.create(req.body));
    } catch (e) { next(e); }
  },

  update: async (req: Request<{}, {}, UpdateRequestDto>, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as RequestIdParams;
      res.json(await requestsService.update(id, req.body));
    } catch (e) { next(e); }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = res.locals.params as RequestIdParams;
      await requestsService.delete(id);
      res.status(204).send();
    } catch (e) { next(e); }
  },
};