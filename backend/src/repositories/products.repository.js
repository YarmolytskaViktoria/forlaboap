const products = [];

module.exports = {
  getAll: () => products,

  getById: (id) => products.find(p => p.id === id),

  create: (product) => {
    products.push(product);
    return product;
  },

  update: (id, updated) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = updated;
    return updated;
  },

  delete: (id) => {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  }
};