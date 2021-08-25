const productController = require('../controllers/product.controller');

module.exports = function (app) {
  app.get('/api/product', productController.getList);
  app.get('/api/product/:id', productController.getById);
  app.post('/api/product', productController.create);
  app.put('/api/product/:id', productController.update);
  app.delete('/api/product/:id', productController.delete);
};
