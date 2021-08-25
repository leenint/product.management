const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const includeAll = require('include-all');
const path = require('path');

global.CError = require('./src/helpers/cerror');
// load configuration
global.config = require('./src/helpers/configuration').init();

const app = express();
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to product management application.' });
});

// routes
app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'product-management-token, Origin, Content-Type, Accept',
  );
  next();
});

const routerInfos = includeAll({
  dirname: path.resolve(__dirname, './src/routers'),
  filter: /(.+)\.js$/,
}) || {};

for (const routerName in routerInfos) {
  if (Object.hasOwnProperty.call(routerInfos, routerName)) {
    const router = routerInfos[routerName];
    if (typeof router === 'function') {
      router(app);
    }
  }
}

// (async function () {
const RedisService = require('./src/helpers/redis.service');

const redisInstance = new RedisService();
// await redisInstance.connect();
global.redisInstance = redisInstance;
// })();

module.exports = app;
