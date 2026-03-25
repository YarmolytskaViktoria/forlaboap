const express = require("express");
const usersRoutes = require("./routes/users.routes");
const productsRoutes = require("./routes/products.routes");
const logger = require("./middleware/request-logging.middleware");
const errorHandler = require("./middleware/error-handler.middleware");

const app = express();

app.use(express.json()); // парсинг JSON
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/products", productsRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});