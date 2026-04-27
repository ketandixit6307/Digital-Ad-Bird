const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../modules/user/model');
const { AppError } = require('./errorHandler');

const authenticate = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401, 'UNAUTHORIZED'));
    }

    const decoded = jwt.verify(token, config.jwt.accessSecret);
    const mongoose = require('mongoose');

    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.userId);
    } else if (decoded.userId === '507f1f77bcf86cd799439011') {
      // Fallback for mock user in DEMO mode
      user = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Demo User',
        email: 'ketandixit192@gmail.com',
        role: 'admin',
        currentPlan: 'pro',
        subscriptionStatus: 'active',
        updateOne: async () => ({ nModified: 1 }), // Mock update
      };
    }

    if (!user) {
      return next(new AppError('User not found or database disconnected', 401, 'UNAUTHORIZED'));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Not authorized to access this route', 403, 'FORBIDDEN'));
    }
    next();
  };
};

module.exports = { authenticate, authorize };
