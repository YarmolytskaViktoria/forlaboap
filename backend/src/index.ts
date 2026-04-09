import express, { Application } from "express";
import usersRoutes from "./routes/users.routes.js";
import productsRoutes from "./routes/products.routes.js";
import { requestLogger } from "./middleware/request-logging.middleware.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";

const app: Application = express();
const PORT = 3000;

// 1. Парсинг вхідного JSON (стандартний middleware)
app.use(express.json());

// 2. Глобальне логування кожного запиту 
app.use(requestLogger);

// 3. Підключення маршрутів
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);

// 4. Глобальний обробник помилок 
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
  console.log(` Products API: http://localhost:${PORT}/api/products`);
  console.log(` Users API: http://localhost:${PORT}/api/users`);
});