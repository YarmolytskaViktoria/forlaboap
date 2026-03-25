const repo = require("../repositories/users.repository");
const { validateCreateUser } = require("../dtos/users.dto");
const { v4: uuid } = require("uuid");

module.exports = {
  getAll: () => repo.getAll(),

  getById: (id) => {
    const user = repo.getById(id);
    if (!user) throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    return user;
  },

  create: (dto) => {
    const errors = validateCreateUser(dto);

    if (errors.length) {
      throw { status: 400, code: "VALIDATION_ERROR", message: "Invalid body", details: errors };
    }

    const user = {
      id: uuid(), // (5.2)
      name: dto.name,
      email: dto.email
    };

    return repo.create(user);
  },

  update: (id, dto) => {
    if (!repo.getById(id)) {
      throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    }

    return repo.update(id, { id, ...dto });
  },

  delete: (id) => {
    if (!repo.delete(id)) {
      throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    }
  }
};