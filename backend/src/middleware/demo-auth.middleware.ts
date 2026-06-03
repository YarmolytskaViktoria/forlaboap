import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { usersRepository } from "../repositories/users.repository.js";
import { AppError } from "../types/errors.js";

const userIdSchema = z.string().uuid();

export async function demoAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.header("X-Demo-UserId"); 

    if (!userId) {
      throw new AppError(401, "UNAUTHORIZED", "X-Demo-UserId header is required");
    }

    if (!userIdSchema.safeParse(userId).success) {
      throw new AppError(401, "UNAUTHORIZED", "Invalid demo user");
    }

    const user = await usersRepository.getById(userId);

    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Invalid demo user");
    }

    res.locals.currentUserId = user.id;
    next();
  } catch (e) {
    next(e);
  }
}