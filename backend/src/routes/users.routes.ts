import { Router } from "express";
import { usersController } from "../controllers/users.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createUserBodySchema,
  userIdParamsSchema,
  updateUserBodySchema,
  listUsersQuerySchema,
} from "../dtos/users.dto.js";
 
const router = Router();
 
router.get(
  "/",
  validate({ query: listUsersQuerySchema }),
  usersController.getAll
);
 
router.get(
  "/:id",
  validate({ params: userIdParamsSchema }),
  usersController.getById
);
 
router.post(
  "/",
  validate({ body: createUserBodySchema }),
  usersController.create
);
 
router.put(
  "/:id",
  validate({ params: userIdParamsSchema, body: updateUserBodySchema }),
  usersController.update
);
 
router.delete(
  "/:id",
  validate({ params: userIdParamsSchema }),
  usersController.delete
);
 
export default router;