const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../user/model');
const config = require('../../config');
const { AppError } = require('../../middleware/errorHandler');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiry,
  });
  const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiry,
  });
  return { accessToken, refreshToken };
};

const register = async (data) => {
  const { name, email, password, organization, phone, industry, size, plan } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 409, 'DUPLICATE_ERROR');
  }

  const user = await User.create({
    name,
    email,
    password,
    organization,
    phone,
    industry,
    size,
    currentPlan: plan || 'none',
    subscriptionStatus: plan ? 'active' : 'trial',
  });

  const { accessToken, refreshToken } = generateTokens(user._id);

  user.refreshTokens.push({ token: refreshToken });
  await user.save();

  return { user, accessToken, refreshToken };
};

const login = async (data) => {
  const { email, password } = data;
  const mongoose = require('mongoose');

  // Fallback for DEMO mode if MongoDB is not connected
  if (mongoose.connection.readyState !== 1) {
    console.warn('MongoDB not connected — using DEMO mode fallback');
    if (email === 'demo@example.com' || email === 'ketandixit192@gmail.com') {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011', // Valid MongoDB ObjectId format
        name: 'Demo User',
        email: email,
        currentPlan: 'pro',
        subscriptionStatus: 'active',
        refreshTokens: [],
        save: async () => {}, // Mock save
      };
      const { accessToken, refreshToken } = generateTokens(mockUser._id);
      return { user: mockUser, accessToken, refreshToken };
    }
    throw new AppError('Database connection timeout. Please check your MongoDB Atlas IP whitelist.', 503, 'DATABASE_ERROR');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  const { accessToken, refreshToken } = generateTokens(user._id);

  // Keep max 5 refresh tokens
  user.refreshTokens = [...user.refreshTokens.slice(-4), { token: refreshToken }];
  await user.save();

  return { user, accessToken, refreshToken };
};

const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Refresh token required', 401, 'UNAUTHORIZED');
  }

  const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
  const user = await User.findById(decoded.userId);

  if (!user || !user.refreshTokens.some(t => t.token === refreshToken)) {
    throw new AppError('Invalid refresh token', 401, 'UNAUTHORIZED');
  }

  const tokens = generateTokens(user._id);

  // Replace old refresh token
  user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
  user.refreshTokens.push({ token: tokens.refreshToken });
  await user.save();

  return tokens;
};

const logout = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== refreshToken);
    await user.save();
  }
  return true;
};

const logoutAll = async (userId) => {
  const user = await User.findById(userId);
  if (user) {
    user.refreshTokens = [];
    await user.save();
  }
  return true;
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  generateTokens,
};
