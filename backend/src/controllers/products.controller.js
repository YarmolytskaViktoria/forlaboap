const service = require("../services/products.service");

module.exports = {
  getAll: (req, res, next) => {
    try { res.status(200).json({ items: service.getAll() }); }
    catch (e) { next(e); }
  },

  getById: (req, res, next) => {
    try { res.status(200).json(service.getById(req.params.id)); }
    catch (e) { next(e); }
  },

  create: (req, res, next) => {
    try { res.status(201).json(service.create(req.body)); }
    catch (e) { next(e); }
  },

  update: (req, res, next) => {
    try { res.status(200).json(service.update(req.params.id, req.body)); }
    catch (e) { next(e); }
  },

  delete: (req, res, next) => {
    try {
      service.delete(req.params.id);
      res.status(204).send();
    } catch (e) { next(e); }
  }
};