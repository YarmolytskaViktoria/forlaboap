import { migrate } from "./migrate.js";
import { run } from "./dbClient.js";
import { createHash } from "crypto";

const hashPassword = (password: string): string =>
  createHash("sha256").update(password).digest("hex");

async function seed() {
  await migrate();
  await run("PRAGMA foreign_keys = ON;");

  const now = new Date().toISOString();

  const userId1 = "4bd25391-caab-4c49-8fd6-3cf79ae2904d";
  const userId2 = "6b93eb42-bf32-4a6d-aef9-06b76f60cddc";
  const userId3 = "8c5d094f-a23c-43c4-af60-f81ab1da690f";
  const userId4 = "df2f816c-75d3-479a-a921-f5d4dcaf377a";
  const userId5 = "5885d7ce-0496-44ed-892a-95f0326eb58e";

  const productId1 = "11111111-1111-4111-8111-111111111111";
  const productId2 = "22222222-2222-4222-8222-222222222222";
  const productId3 = "33333333-3333-4333-8333-333333333333";
  const productId4 = "44444444-4444-4444-8444-444444444444";
  const productId5 = "55555555-5555-4555-8555-555555555555";
  const productId6 = "66666666-6666-4666-8666-666666666666";

  await run(
    `
    INSERT OR REPLACE INTO Users (id, name, email, password, createdAt)
    VALUES (?, ?, ?, ?, ?);
    `,
    [userId1, "Alice", "alice@seed.com", hashPassword("secret123"), now]
  );

  await run(
    `
    INSERT OR REPLACE INTO Users (id, name, email, password, createdAt)
    VALUES (?, ?, ?, ?, ?);
    `,
    [userId2, "Bob", "bob@seed.com", hashPassword("secret123"), now]
  );

  await run(
    `
    INSERT OR REPLACE INTO Users (id, name, email, password, createdAt)
    VALUES (?, ?, ?, ?, ?);
    `,
    [userId3, "Carol", "carol@seed.com", hashPassword("secret123"), now]
  );

  await run(
    `
    INSERT OR REPLACE INTO Users (id, name, email, password, createdAt)
    VALUES (?, ?, ?, ?, ?);
    `,
    [userId4, "David", "david@seed.com", hashPassword("secret123"), now]
  );

  await run(
    `
    INSERT OR REPLACE INTO Users (id, name, email, password, createdAt)
    VALUES (?, ?, ?, ?, ?);
    `,
    [userId5, "Eva", "eva@seed.com", hashPassword("secret123"), now]
  );

  console.log("Seeded: Users (5)");

  await run(
    `
    INSERT OR REPLACE INTO Products
    (id, name, licenseType, userEmail, ownerUserId, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    [productId1, "MatLab", "Academic", "alice@seed.com", userId1, "Для лабораторій", now]
  );

  await run(
    `
    INSERT OR REPLACE INTO Products
    (id, name, licenseType, userEmail, ownerUserId, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    [productId2, "AutoCAD", "Commercial", "bob@seed.com", userId2, "Проєктування", now]
  );

  await run(
    `
    INSERT OR REPLACE INTO Products
    (id, name, licenseType, userEmail, ownerUserId, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    [productId3, "VirtualBox", "Free", "carol@seed.com", userId3, "Безкоштовне ПЗ", now]
  );

  await run(
    `
    INSERT OR REPLACE INTO Products
    (id, name, licenseType, userEmail, ownerUserId, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    [productId4, "Photoshop", "Commercial", "david@seed.com", userId4, "Графічний редактор", now]
  );

  await run(
    `
    INSERT OR REPLACE INTO Products
    (id, name, licenseType, userEmail, ownerUserId, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    [productId5, "Microsoft Office", "Academic", "eva@seed.com", userId5, "Офісний пакет", now]
  );

  await run(
    `
    INSERT OR REPLACE INTO Products
    (id, name, licenseType, userEmail, ownerUserId, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    `,
    [productId6, "Ubuntu", "Free", "alice@seed.com", userId1, "Операційна система", now]
  );

  console.log("Seeded: Products (6)");

  await run("DELETE FROM Requests;");

  await run(
    `
    INSERT INTO Requests (id, userId, productId, status, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?);
    `,
    ["aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", userId1, productId2, "pending", "Потрібен для проєкту", now]
  );

  await run(
    `
    INSERT INTO Requests (id, userId, productId, status, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?);
    `,
    ["bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", userId2, productId1, "approved", "Схвалено керівником", now]
  );

  await run(
    `
    INSERT INTO Requests (id, userId, productId, status, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?);
    `,
    ["cccccccc-cccc-4ccc-8ccc-cccccccccccc", userId3, productId3, "rejected", "Вже є альтернатива", now]
  );

  await run(
    `
    INSERT INTO Requests (id, userId, productId, status, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?);
    `,
    ["dddddddd-dddd-4ddd-8ddd-dddddddddddd", userId4, productId4, "pending", "Для дизайн курсу", now]
  );

  await run(
    `
    INSERT INTO Requests (id, userId, productId, status, comment, createdAt)
    VALUES (?, ?, ?, ?, ?, ?);
    `,
    ["eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee", userId5, productId5, "approved", "Для навчання", now]
  );

  console.log("Seeded: Requests (5)");
  console.log("Seed completed successfully");

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});