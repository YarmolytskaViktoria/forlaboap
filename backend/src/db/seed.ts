import { migrate } from "./migrate.js";
import { run } from "./dbClient.js";
import { v4 as uuid } from "uuid";
import { createHash } from "crypto";

const hashPassword = (password: string): string =>
  createHash("sha256").update(password).digest("hex");

async function seed() {
  await migrate();
   await run("PRAGMA foreign_keys = ON;");

  const now = new Date().toISOString();

  // Users
  const userId1 = uuid();
  const userId2 = uuid();
  const userId3 = uuid();
  const userId4 = uuid();
  const userId5 = uuid();

  await run(`INSERT OR IGNORE INTO Users (id, name, email, password, createdAt) VALUES ('${userId1}', 'Alice', 'alice@seed.com', '${hashPassword("secret123")}', '${now}');`);
  await run(`INSERT OR IGNORE INTO Users (id, name, email, password, createdAt) VALUES ('${userId2}', 'Bob', 'bob@seed.com', '${hashPassword("secret123")}', '${now}');`);
  await run(`INSERT OR IGNORE INTO Users (id, name, email, password, createdAt) VALUES ('${userId3}', 'Carol', 'carol@seed.com', '${hashPassword("secret123")}', '${now}');`);
  await run(`INSERT OR IGNORE INTO Users (id, name, email, password, createdAt) VALUES ('${userId4}', 'David', 'david@seed.com', '${hashPassword("secret123")}', '${now}');`);
  await run(`INSERT OR IGNORE INTO Users (id, name, email, password, createdAt) VALUES ('${userId5}', 'Eva', 'eva@seed.com', '${hashPassword("secret123")}', '${now}');`);

  console.log("Seeded: Users (5)");

  // Products
  const productId1 = uuid();
  const productId2 = uuid();
  const productId3 = uuid();
  const productId4 = uuid();
  const productId5 = uuid();
  const productId6 = uuid();

  await run(`INSERT OR IGNORE INTO Products (id, name, licenseType, userEmail, comment, createdAt) VALUES ('${productId1}', 'MatLab', 'Academic', 'alice@seed.com', 'Для лабораторій', '${now}');`);
  await run(`INSERT OR IGNORE INTO Products (id, name, licenseType, userEmail, comment, createdAt) VALUES ('${productId2}', 'AutoCAD', 'Commercial', 'bob@seed.com', 'Проєктування', '${now}');`);
  await run(`INSERT OR IGNORE INTO Products (id, name, licenseType, userEmail, comment, createdAt) VALUES ('${productId3}', 'VirtualBox', 'Free', 'carol@seed.com', 'Безкоштовне ПЗ', '${now}');`);
  await run(`INSERT OR IGNORE INTO Products (id, name, licenseType, userEmail, comment, createdAt) VALUES ('${productId4}', 'Photoshop', 'Commercial', 'david@seed.com', 'Графічний редактор', '${now}');`);
  await run(`INSERT OR IGNORE INTO Products (id, name, licenseType, userEmail, comment, createdAt) VALUES ('${productId5}', 'Microsoft Office', 'Academic', 'eva@seed.com', 'Офісний пакет', '${now}');`);
  await run(`INSERT OR IGNORE INTO Products (id, name, licenseType, userEmail, comment, createdAt) VALUES ('${productId6}', 'Ubuntu', 'Free', 'alice@seed.com', 'Операційна система', '${now}');`);

  console.log("Seeded: Products (6)");

  // Requests
  await run(`INSERT OR IGNORE INTO Requests (id, userId, productId, status, comment, createdAt) VALUES ('${uuid()}', '${userId1}', '${productId2}', 'pending', 'Потрібен для проєкту', '${now}');`);
  await run(`INSERT OR IGNORE INTO Requests (id, userId, productId, status, comment, createdAt) VALUES ('${uuid()}', '${userId2}', '${productId1}', 'approved', 'Схвалено керівником', '${now}');`);
  await run(`INSERT OR IGNORE INTO Requests (id, userId, productId, status, comment, createdAt) VALUES ('${uuid()}', '${userId3}', '${productId3}', 'rejected', 'Вже є альтернатива', '${now}');`);
  await run(`INSERT OR IGNORE INTO Requests (id, userId, productId, status, comment, createdAt) VALUES ('${uuid()}', '${userId4}', '${productId4}', 'pending', 'Для дизайн курсу', '${now}');`);
  await run(`INSERT OR IGNORE INTO Requests (id, userId, productId, status, comment, createdAt) VALUES ('${uuid()}', '${userId5}', '${productId5}', 'approved', 'Для навчання', '${now}');`);
  await run(`INSERT OR IGNORE INTO Requests (id, userId, productId, status, comment, createdAt) VALUES ('${uuid()}', '${userId1}', '${productId6}', 'pending', 'Для віртуальної машини', '${now}');`);
  await run(`INSERT OR IGNORE INTO Requests (id, userId, productId, status, comment, createdAt) VALUES ('${uuid()}', '${userId2}', '${productId4}', 'rejected', 'Немає бюджету', '${now}');`);
  await run(`INSERT OR IGNORE INTO Requests (id, userId, productId, status, comment, createdAt) VALUES ('${uuid()}', '${userId3}', '${productId2}', 'approved', 'Потрібен терміново', '${now}');`);

  console.log("Seeded: Requests (8)");
  console.log("Seed completed successfully");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});