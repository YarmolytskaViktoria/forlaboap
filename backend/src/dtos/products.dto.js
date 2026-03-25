const allowedTypes = ["Free", "Academic", "Commercial"];

module.exports = {
  // 2.1. CreateXRequestDto + Валідація (6.1-6.4)
  CreateProductRequestDto: (data) => {
    const errors = [];
    if (!data.name || data.name.length < 3) errors.push({ field: "name", message: "Min length 3" });
    if (!allowedTypes.includes(data.licenseType)) errors.push({ field: "licenseType", message: "Invalid type" });
    if (!data.userEmail || !data.userEmail.includes("@")) errors.push({ field: "userEmail", message: "Invalid email" });
    
    if (errors.length > 0) {
      throw { status: 400, code: "VALIDATION_ERROR", message: "Invalid request body", details: errors };
    }

    return {
      name: data.name,
      licenseType: data.licenseType,
      userEmail: data.userEmail,
      createdAt: new Date().toISOString(), 
      comment: data.comment || ""
    };
  },

  // 2.2. UpdateXRequestDto
  UpdateProductRequestDto: (data) => ({
    name: data.name,
    licenseType: data.licenseType,
    comment: data.comment
  }),

  // 2.3. XResponseDto (5.2. Містить ID, 5.3.)
  ProductResponseDto: (model) => ({
    id: model.id,
    name: model.name,
    licenseType: model.licenseType,
    userEmail: model.userEmail,
    createdAt: model.createdAt
  })
};