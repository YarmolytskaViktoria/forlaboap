import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../types/errors.js";
 
/*
  Єдиний формат помилки для всіх ендпойнтів:
  {
    "error": {
      "code": "string",
      "message": "string",
      "details": [{ "field": "string", "message": "string" }]  // опційно
    }
  }
*/
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("[ERROR]", err);
 
  // Zod validation error → 400
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
 
  // AppError — наші власні помилки (404, 409, тощо)
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
 
  // Підтримка старого стилю: throw { status, code, message }
  if (err.status && err.code) {
    res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }
 
  // Непередбачена помилка → 500
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong",
    },
  });
};