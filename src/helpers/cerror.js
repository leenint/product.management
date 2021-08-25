/* eslint-disable no-underscore-dangle */
class CError extends Error {
  get status() {
    return this._status || 400;
  }

  set status(value) {
    this._status = value;
  }
}

module.exports = CError;
