const repo = require("../repositories/users.repository");
const { v4: uuid } = require("uuid");
const { 
  CreateUserRequestDto, 
  UpdateUserRequestDto, 
  UserResponseDto 
} = require("../dtos/users.dto");

module.exports = {
  // Повертаємо масив, де кожен юзер пропущений через ResponseDto (без паролів)
  getAll: () => repo.getAll().map(UserResponseDto),
  
  getById: (id) => {
    const user = repo.getById(id);
    if (!user) {
      throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    }
    return UserResponseDto(user);
  },

  create: (data) => {
    // 2.1. Валідація та фільтрація вхідних даних
    const dto = CreateUserRequestDto(data); 
    
    // 5.1. Створення ID на сервері
    const newUser = { 
      id: uuid(), 
      ...dto 
    };
    
    const saved = repo.create(newUser);
    return UserResponseDto(saved); // 2.3. Повертаємо результат через DTO
  },

  update: (id, data) => {
    if (!repo.getById(id)) {
      throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    }
    
    // 2.2. Тільки дозволені для оновлення поля
    const dto = UpdateUserRequestDto(data);
    const updated = repo.update(id, { id, ...dto });
    
    return UserResponseDto(updated);
  },

  delete: (id) => {
    if (!repo.delete(id)) {
      throw { status: 404, code: "NOT_FOUND", message: "User not found" };
    }
    return true;
  }
};