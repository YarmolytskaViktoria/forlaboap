const service = require("../services/users.service");

module.exports = {
  getAll: (req, res, next) => {
    try { 
      res.status(200).json({ items: service.getAll() }); 
    } catch (e) { next(e); }
  },

  getById: (req, res, next) => {
    try { 
      res.status(200).json(service.getById(req.params.id)); 
    } catch (e) { next(e); }
  },

  create: (req, res, next) => {
    try { 
      // POST повертає 201 Created за критеріями
      const result = service.create(req.body);
      res.status(201).json(result); 
    } catch (e) { next(e); }
  },

  update: (req, res, next) => {
    try { 
      const result = service.update(req.params.id, req.body);
      res.status(200).json(result); 
    } catch (e) { next(e); }
  },

  delete: (req, res, next) => {
    try {
      service.delete(req.params.id);
      // DELETE повертає 204 No Content
      res.status(204).send(); 
    } catch (e) { next(e); }
  }
};