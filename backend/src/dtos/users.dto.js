function validateCreateUser(dto) {
  const errors = [];

  if (!dto.name || dto.name.length < 2) {
    errors.push({ field: "name", message: "Name min length 2" });
  }

  if (!dto.email || !dto.email.includes("@")) {
    errors.push({ field: "email", message: "Invalid email" });
  }

  return errors;
}

module.exports = { validateCreateUser };