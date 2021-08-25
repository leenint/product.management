const Redis = require('ioredis');

class RedisService {
  constructor() {
    const {
      host,
      port,
      password,
    } = global.config.redis;
    this.options = global.config.redis;

    this.client = new Redis({
      port,
      host,
      password,
      db: 0,
    });
    this.prefix = 'product.management';
    this.connected = true;
  }

  async connect() {
    try {
      await this.client.connect();
      this.connected = true;
      console.log('connect redis successed.');
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  /**
  * function get value in redis cache by key
  * @param {string} key
  * @returns {Object} - it will null if not exists key.
  */
  async get(key) {
    if (this.client == null || !this.connected) {
      console.error('Client redis is not define OR redis is not connected');
      return null;
    }

    const redisKey = `${this.prefix}:${key}`;
    const val = await this.client.get(redisKey);
    return val != null ? JSON.parse(val) : null;
  }

  /**
   * function set redis cache by key
   * @param {string} key
   * @param {Object} value
   * @param {number} ttl - seconds to keep cache of key alive
   */
  async set(key, value, ttl = this.options.ttl) {
    if (this.client == null || !this.connected) {
      throw Error('Client redis is not define OR redis is not connected');
    }

    const redisKey = `${this.prefix}:${key}`;
    if (value == null) {
      await this.del(redisKey);
      return;
    }

    await this.client.set(redisKey, JSON.stringify(value));
    if (ttl > 0) {
      await this.client.expire(redisKey, ttl);
    }
  }

  async del(key) {
    if (this.client == null || !this.connected) {
      throw Error('Client redis is not define OR redis is not connected');
    }

    const redisKey = `${this.prefix}:${key}`;
    await this.client.del(redisKey);
  }
}

module.exports = RedisService;
