const users = [];

module.exports = {
  getAll: () => users,

  getById: (id) => users.find(u => u.id === id),

  create: (user) => {
    users.push(user);
    return user;
  },

  update: (id, updated) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = updated;
    return updated;
  },

  delete: (id) => {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
  }
};