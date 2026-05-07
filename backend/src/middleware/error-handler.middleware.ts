import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../types/errors.js";
 
/*
  Єдиний формат помилки:
  {
    "error": {
      "code": "string",
      "message": "string",
      "details": [{ "field": "string", "message": "string" }]  
    }
  }
*/
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("[ERROR]", err);
 
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: "Validation failed",
        details: err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }
 
  if (err instanceof AppError) {
    res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details.length > 0 && { details: err.details }),
      },
    });
    return;
  }
 
  if (err.status && err.code) {
    res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }
 
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong",
    },
  });
};