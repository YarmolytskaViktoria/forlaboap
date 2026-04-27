import { Request, Response, NextFunction } from "express";
import { z } from "zod";
 
export const validate = (schemas: {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
 
      if (schemas.query) {
        res.locals.query = await schemas.query.parseAsync(req.query);
      }
 
      if (schemas.params) {
        res.locals.params = await schemas.params.parseAsync(req.params);
      }
 
      next();
    } catch (error) {
      next(error);
    }
  };
};