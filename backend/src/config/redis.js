const Redis = require('ioredis');
const config = require('./index');
const logger = require('./logger');

let redis = null;
try {
  redis = new Redis(config.redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    showFriendlyErrorStack: false,
    retryStrategy(times) {
      return null; // Stop retrying immediately to prevent spam
    },
    lazyConnect: true,
  });

  redis.on('connect', () => {
    logger.info('Redis Connected Successfully');
  });

  redis.on('error', (err) => {
    // Only log once to avoid spam
    if (redis._hasLoggedError) return;
    logger.warn('Redis not available: ' + err.message);
    redis._hasLoggedError = true;
  });
} catch (err) {
  logger.warn('Redis initialization failed: ' + err.message);
  redis = null;
}

module.exports = redis;
