const { branchClient } = require('../helpers/grpcClient');

const BranchProvider = {
  getList() {
    return new Promise((resolve, reject) => {
      branchClient.getAll({}, (error, { items, total }) => {
        if (error) {
          reject(error);
        }

        resolve({ items, total });
      });
    });
  },
};

module.exports = BranchProvider;
