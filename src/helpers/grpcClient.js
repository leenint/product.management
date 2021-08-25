const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PRODUCT_PROTO_PATH = './src/protos/product.proto';
const BRANCH_PROTO_PATH = './src/protos/branch.proto';

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

const { ProductService } = grpc.loadPackageDefinition(protoLoader.loadSync(PRODUCT_PROTO_PATH, options));
const productClient = new ProductService(
  'localhost:50051',
  grpc.credentials.createInsecure(),
);

const { BranchService } = grpc.loadPackageDefinition(protoLoader.loadSync(BRANCH_PROTO_PATH, options));
const branchClient = new BranchService(
  'localhost:50051',
  grpc.credentials.createInsecure(),
);

module.exports = {
  productClient,
  branchClient,
};
