const _ = require('lodash');
const logger = require('./logger');

const Response = {};

Response.getErrorBodyData = (data) => {
  if (_.isArray(data)) {
    data = _.map(data, (item) => {
      if (item instanceof Error || item instanceof TypeError || item instanceof SyntaxError) {
        item = Response.getErrorBodyData(item);
      }
      return item;
    });
    return data;
  }
  if (_.isPlainObject(data)) {
    let plainObj;
    try {
      plainObj = JSON.parse(JSON.stringify(data));
    } catch (e) {
      // do nothing
    }
    if (plainObj) {
      return plainObj;
    }
  }
  return [{ code: 'GENERIC_ERROR', message: data.message || data.toString() }];
};

Response.prepareFormat = (
  req,
  res,
  body = null,
  statusCode = 200,
  err = null,
) => {
  statusCode = parseInt(statusCode, 10) || 500;
  let message = err;
  if (err instanceof Error) {
    message = err.message;
  }
  const dataFormat = {
    data: [],
    version: '1.0.0',
    service: 'product.management',
    dateTime: new Date(),
    apiName: req.originalUrl || req.baseUrl,
    code: statusCode,
    message,
    isSuccess: true,
    errors: [],
  };
  if (statusCode >= 300) {
    dataFormat.isSuccess = false;
    dataFormat.data = null;
    try {
      dataFormat.errors = Response.getErrorBodyData(body || err);
    } catch (error) {
      dataFormat.errors = Response.getErrorBodyData(error);
    }
    dataFormat.message = message || 'Error';
  } else {
    dataFormat.data = body;
    dataFormat.message = message || 'Success';
  }
  return dataFormat;
};

Response.send = (
  req,
  res,
  body = null,
  statusCode = 200,
  msg = null,
) => {
  res.set('Connection', 'close');
  if (msg instanceof CError) {
    statusCode = 400;
    msg = msg.message;
  }
  if (body instanceof CError) {
    statusCode = 400;
    msg = body.message;
    body = null;
  }
  const dataFormat = Response.prepareFormat(req, res, body, statusCode, msg);
  if (statusCode === 500) {
    logger.writeLog({ req, res, body: dataFormat, statusCode, error: msg });
  }
  return res.status(dataFormat.code).send(dataFormat);
};

module.exports = Response;
