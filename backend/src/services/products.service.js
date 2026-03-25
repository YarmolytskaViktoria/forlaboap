const repo = require("../repositories/products.repository");
const { v4: uuid } = require("uuid");
const { CreateProductRequestDto, UpdateProductRequestDto, ProductResponseDto } = require("../dtos/products.dto");

module.exports = {
  getAll: () => repo.getAll().map(ProductResponseDto),
  
  getById: (id) => {
    const item = repo.getById(id);
    if (!item) throw { status: 404, code: "NOT_FOUND", message: "Product not found" }; // Вимога 404
    return ProductResponseDto(item);
  },

  create: (data) => {
    const dto = CreateProductRequestDto(data); // Тут же спрацює валідація
    const product = { id: uuid(), ...dto }; // 5.1. Створення ID на сервері
    return ProductResponseDto(repo.create(product));
  },

  update: (id, data) => {
    if (!repo.getById(id)) throw { status: 404, code: "NOT_FOUND", message: "Product not found" };
    const dto = UpdateProductRequestDto(data);
    return ProductResponseDto(repo.update(id, { id, ...dto }));
  },

  delete: (id) => {
    if (!repo.delete(id)) throw { status: 404, code: "NOT_FOUND", message: "Product not found" };
  }
};