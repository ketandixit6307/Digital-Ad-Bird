const mongoose = require('mongoose');
const config = require('./index');
const logger = require('./logger');

const connectDB = async () => {
  try {
    // Disable buffering so operations fail fast if not connected
    mongoose.set('bufferCommands', false);
    
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout instead of hanging
    });
    logger.info('MongoDB Connected Successfully');
  } catch (err) {
    logger.warn('MongoDB not available at ' + config.mongoUri);
    logger.warn('Running in DEMO mode — API endpoints will return mock data');
    logger.warn('To enable full functionality, start MongoDB or use Docker Compose');
  }
};

module.exports = { connectDB };
