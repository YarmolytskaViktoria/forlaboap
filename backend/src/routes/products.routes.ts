import { Router } from "express";
import { productsController } from "../controllers/products.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { 
  createProductBodySchema, 
  productIdParamsSchema, 
  listProductsQuerySchema 
} from "../dtos/products.dto";

const router = Router();

// 3.1. GET /api/products – (з фільтрацією через Query)
router.get("/", validate({ query: listProductsQuerySchema }), productsController.getAll);

// 3.2. GET /api/products/:id
router.get("/:id", validate({ params: productIdParamsSchema }), productsController.getById);

// 3.3. POST /api/products
router.post("/", validate({ body: createProductBodySchema }), productsController.create);

// 3.4. PUT /api/products/:id
router.put("/:id", validate({ params: productIdParamsSchema, body: createProductBodySchema.partial() }), productsController.update);

// 3.5. DELETE /api/products/:id
router.delete("/:id", validate({ params: productIdParamsSchema }), productsController.delete);

export default router;