const { productClient } = require('../helpers/grpcClient');

const ProductProvider = {
  getList(params) {
    return new Promise((resolve, reject) => {
      productClient.getAllProduct(params, (error, { items, total }) => {
        if (error) {
          reject(error);
        }

        resolve({ items, total });
      });
    });
  },

  getById(id) {
    return new Promise((resolve, reject) => {
      productClient.getProduct({ id }, (error, product) => {
        if (error) {
          reject(error);
        }

        resolve(product);
      });
    });
  },

  create(product) {
    return new Promise((resolve, reject) => {
      productClient.addProduct(product, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  },

  update(product) {
    return new Promise((resolve, reject) => {
      productClient.editProduct(product, (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  },

  delete(id) {
    return new Promise((resolve, reject) => {
      productClient.deleteProduct({ id }, (error, product) => {
        if (error) {
          reject(error);
        }

        resolve(product);
      });
    });
  },
};

module.exports = ProductProvider;
