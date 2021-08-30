const HttpStatus = require('http-status-codes');
const ProductProvider = require('../data-providers/product.provider');
const Response = require('../helpers/response');
const Validator = require('../helpers/validator');

const controller = {
  getList: async (req, res) => {
    try {
      const {
        name,
        code,
        branchId,
        color,
        sortBy,
        sortType,
        pageSize,
        pageNum,
      } = req.query;

      const { items, total } = await ProductProvider.getList({
        name,
        code,
        branchId,
        color,
        sortBy,
        sortType,
        pageSize,
        pageNum,
      });
      return Response.send(req, res, { items, total });
    } catch (ex) {
      return Response.send(req, res, null, HttpStatus.INTERNAL_SERVER_ERROR, ex);
    }
  },

  getById: async (req, res) => {
    try {
      const product = await ProductProvider.getById(req.params.id);
      if (!product) {
        return Response.send(req, res, null, HttpStatus.NOT_FOUND, 'Product Not found.');
      }

      return Response.send(req, res, product);
    } catch (ex) {
      return Response.send(req, res, null, HttpStatus.INTERNAL_SERVER_ERROR, ex);
    }
  },

  create: async (req, res) => {
    try {
      const product = req.body;

      const validateResult = Validator.validate(product, {
        name: { type: 'string' },
        code: { type: 'string' },
        description: { type: 'string', optional: true },
        branchId: { type: 'str-num' },
        colors: {
          type: 'array',
          optional: true,
          empty: false,
          item: {
            type: 'string',
          },
        },
      });
      if (validateResult) {
        return Response.send(req, res, { message: validateResult }, HttpStatus.BAD_REQUEST, validateResult);
      }

      const productEntity = await ProductProvider.create(req.body);
      return Response.send(req, res, productEntity, HttpStatus.OK, 'Product was created successfully!');
    } catch (ex) {
      return Response.send(req, res, null, HttpStatus.INTERNAL_SERVER_ERROR, ex);
    }
  },

  update: async (req, res) => {
    try {
      const product = {
        ...req.body,
        id: req.params.id,
      };

      await ProductProvider.update(product);
      return Response.send(req, res, product, HttpStatus.OK, 'Product was updated successfully!');
    } catch (ex) {
      return Response.send(req, res, null, HttpStatus.INTERNAL_SERVER_ERROR, ex);
    }
  },

  delete: async (req, res) => {
    try {
      await ProductProvider.delete(req.params.id);

      return Response.send(req, res, null, HttpStatus.OK, 'Product was deleted successfully!');
    } catch (ex) {
      return Response.send(req, res, null, HttpStatus.INTERNAL_SERVER_ERROR, ex);
    }
  },
};

module.exports = controller;
