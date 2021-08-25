const branchController = require('../controllers/branch.controller');

module.exports = function (app) {
  app.get('/api/branch', branchController.getList);
};
