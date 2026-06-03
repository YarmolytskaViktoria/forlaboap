import { Router } from "express";
import { productsController } from "../controllers/products.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { demoAuth } from "../middleware/demo-auth.middleware.js";
import {
  createProductBodySchema,
  updateProductBodySchema,
  productIdParamsSchema,
  listProductsQuerySchema,
} from "../dtos/products.dto.js";

const router = Router();

router.use(demoAuth); // Всі маршрути захищені аутентифікацією

router.get("/stats", productsController.getStats);

router.get("/search", productsController.search);

router.get(
  "/",
  validate({ query: listProductsQuerySchema }),
  productsController.getAll
);

router.get(
  "/:id",
  validate({ params: productIdParamsSchema }),
  productsController.getById
);

router.post(
  "/",
  validate({ body: createProductBodySchema }),
  productsController.create
);

router.put(
  "/:id",
  validate({
    params: productIdParamsSchema,
    body: updateProductBodySchema,
  }),
  productsController.update
);

router.delete(
  "/:id",
  validate({ params: productIdParamsSchema }),
  productsController.delete
);

export default router;