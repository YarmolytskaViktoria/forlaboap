const allowed = ["Free", "Academic", "Commercial"];

function validateCreateProduct(dto) {
  const errors = [];

  if (!dto.name || dto.name.length < 3) {
    errors.push({ field: "name", message: "Min length 3" });
  }

  if (!allowed.includes(dto.licenseType)) {
    errors.push({ field: "licenseType", message: "Invalid type" });
  }

  if (!dto.userEmail || !dto.userEmail.includes("@")) {
    errors.push({ field: "userEmail", message: "Invalid email" });
  }

  if (!dto.createdAt) {
    errors.push({ field: "createdAt", message: "Date required" });
  }

  if (dto.comment && dto.comment.length > 200) {
    errors.push({ field: "comment", message: "Max 200 chars" });
  }

  return errors;
}

module.exports = { validateCreateProduct };