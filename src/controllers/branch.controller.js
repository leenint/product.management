const HttpStatus = require('http-status-codes');
const BranchProvider = require('../data-providers/branch.provider');
const Response = require('../helpers/response');

const controller = {
  getList: async (req, res) => {
    try {
      let cacheBranchs = await global.redisInstance.get('all-branch');
      if (cacheBranchs == null) {
        const items = await BranchProvider.getList();
        await global.redisInstance.set('all-branch', items);
        cacheBranchs = items;
        console.log('called grpc server');
      }
      return Response.send(req, res, cacheBranchs);
    } catch (ex) {
      return Response.send(req, res, null, HttpStatus.INTERNAL_SERVER_ERROR, ex);
    }
  },
};

module.exports = controller;
