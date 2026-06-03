import express, { Application } from "express";
import cors from "cors";
import usersRoutes from "./routes/users.routes.js";
import productsRoutes from "./routes/products.routes.js";
import requestsRoutes from "./routes/requests.routes.js";
import { requestLogger } from "./middleware/request-logging.middleware.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";
import { securityHeaders } from "./middleware/security-headers.middleware.js";
import { migrate } from "./db/migrate.js";

const app: Application = express();
const PORT = 3000;

// --- CORS ---
const allowedOrigins = [
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.disable("x-powered-by");

app.use(securityHeaders);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("CORS: origin is not allowed"), false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Demo-UserId"],
}));

app.options("/{*path}", cors());

app.use(express.json());
app.use(requestLogger);

app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/products", productsRoutes);
app.use("/api/v1/requests", requestsRoutes);

app.use(errorHandler);

async function bootstrap() {
  await migrate();

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Products API: http://localhost:${PORT}/api/v1/products`);
    console.log(`Users API: http://localhost:${PORT}/api/v1/users`);
    console.log(`Requests API: http://localhost:${PORT}/api/v1/requests`);
  });
}

bootstrap().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});