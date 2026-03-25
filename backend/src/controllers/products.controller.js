const service = require("../services/products.service");

module.exports = {
  getAll: (req, res, next) => {
    try { res.json({ items: service.getAll() }); } catch (e) { next(e); }
  },
  getById: (req, res, next) => {
    try { res.json(service.getById(req.params.id)); } catch (e) { next(e); }
  },
  create: (req, res, next) => {
    try { 
      const result = service.create(req.body);
      res.status(201).json(result); // Вимога: 201 Created
    } catch (e) { next(e); }
  },
  update: (req, res, next) => {
    try { res.json(service.update(req.params.id, req.body)); } catch (e) { next(e); }
  },
  delete: (req, res, next) => {
    try { 
      service.delete(req.params.id); 
      res.status(204).send(); // Вимога: 204 No Content
    } catch (e) { next(e); }
  }
};