const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

const config = require('./config');
const { connectDB } = require('./config/database');
const logger = require('./config/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const socketService = require('./services/socketService');
const { createCampaignWorker } = require('./services/queueService');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: config.frontendUrl, credentials: true },
});

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.frontendUrl, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use('/api/', apiLimiter);

// Socket.io injection
app.use((req, res, next) => { req.io = io; next(); });

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// API routes
const routes = require('./routes');
app.use('/api', routes);

// Error handler
app.use(errorHandler);

// Database connection
connectDB();

// Start server
server.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

// Initialize Socket.io
socketService.initialize(io);

// Start campaign worker
createCampaignWorker();

// Global error handlers
process.on('unhandledRejection', (reason) => {
  // Suppress ioredis/BullMQ connection errors — Redis is optional
  const isRedisError = (err) => 
    err && (
      (typeof err.message === 'string' && err.message.includes('ECONNREFUSED')) ||
      (typeof err.code === 'string' && err.code === 'ECONNREFUSED') ||
      (err.errors && Array.isArray(err.errors) && err.errors.some(e => e.code === 'ECONNREFUSED'))
    );

  if (isRedisError(reason)) return;
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  if (config.nodeEnv === 'production') process.exit(1);
});
