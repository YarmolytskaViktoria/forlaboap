const repo = require("../repositories/products.repository");
const { validateCreateProduct } = require("../dtos/products.dto");
const { v4: uuid } = require("uuid");

module.exports = {
  getAll: () => repo.getAll(),

  getById: (id) => {
    const item = repo.getById(id);
    if (!item) throw { status: 404, code: "NOT_FOUND", message: "Product not found" };
    return item;
  },

  create: (dto) => {
    const errors = validateCreateProduct(dto);

    if (errors.length) {
      throw {
        status: 400,
        code: "VALIDATION_ERROR",
        message: "Invalid request body",
        details: errors
      };
    }

    const product = {
      id: uuid(),
      name: dto.name,
      licenseType: dto.licenseType,
      userEmail: dto.userEmail,
      createdAt: dto.createdAt,
      comment: dto.comment || ""
    };

    return repo.create(product);
  },

  update: (id, dto) => {
    if (!repo.getById(id)) {
      throw { status: 404, code: "NOT_FOUND", message: "Product not found" };
    }

    const updated = { id, ...dto };
    return repo.update(id, updated);
  },

  delete: (id) => {
    if (!repo.delete(id)) {
      throw { status: 404, code: "NOT_FOUND", message: "Product not found" };
    }
  }
};