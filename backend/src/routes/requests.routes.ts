import { Router } from "express";
import { requestsController } from "../controllers/requests.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createRequestBodySchema,
  requestIdParamsSchema,
  listRequestsQuerySchema,
  updateRequestBodySchema,
} from "../dtos/requests.dto.js";

const router = Router();

// JOIN: запити з деталями юзера та продукту
router.get("/with-details", requestsController.getWithDetails);

// Агрегація: кількість запитів по кожному статусу
router.get("/stats", requestsController.getStats);

router.get(
  "/",
  validate({ query: listRequestsQuerySchema }),
  requestsController.getAll
);

router.get(
  "/:id",
  validate({ params: requestIdParamsSchema }),
  requestsController.getById
);

router.post(
  "/",
  validate({ body: createRequestBodySchema }),
  requestsController.create
);

router.put(
  "/:id",
  validate({
    params: requestIdParamsSchema,
    body: updateRequestBodySchema,
  }),
  requestsController.update
);

router.delete(
  "/:id",
  validate({ params: requestIdParamsSchema }),
  requestsController.delete
);

export default router;