import express, { Application } from "express";
import usersRoutes from "./routes/users.routes.js";
import productsRoutes from "./routes/products.routes.js";
import requestsRoutes from "./routes/requests.routes.js";
import { requestLogger } from "./middleware/request-logging.middleware.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { migrate } from "./db/migrate.js";  // 3 лаба

const app: Application = express();
const PORT = 3000;

app.use(express.json());

app.use(requestLogger);

// Підключення маршрутів
app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/requests", requestsRoutes);

// Глобальний обробник помилок 
app.use(errorHandler);

async function bootstrap() {  // 3 лаба
  await migrate();            // 3 лаба
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Products API: http://localhost:${PORT}/api/products`);
    console.log(`Users API: http://localhost:${PORT}/api/users`);
    console.log(`Requests API: http://localhost:${PORT}/api/requests`);
  });
}

// 3 лаба
bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});