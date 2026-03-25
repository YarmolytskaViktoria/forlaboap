module.exports = {
  CreateUserRequestDto: (data) => {
    const errors = [];
    if (!data.name || data.name.length < 2) errors.push({ field: "name", message: "Name too short" });
    if (!data.email || !data.email.includes("@")) errors.push({ field: "email", message: "Invalid email" });

    if (errors.length > 0) {
      throw { status: 400, code: "VALIDATION_ERROR", message: "Invalid body", details: errors };
    }
    return { name: data.name, email: data.email, password: data.password };
  },

  UpdateUserRequestDto: (data) => ({
    name: data.name,
    email: data.email
  }),

  UserResponseDto: (user) => ({
    id: user.id,
    name: user.name,
    email: user.email
  })
};