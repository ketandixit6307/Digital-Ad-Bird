const authService = require('./service');
const config = require('../../config');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.validatedData);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.status(201).json({
      success: true,
      data: { user, accessToken },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.validatedData);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
    res.status(200).json({
      success: true,
      data: { user, accessToken },
    });
  } catch (err) {
    next(err);
  }
};

const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.validatedData?.refreshToken;
    const tokens = await authService.refresh(refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, COOKIE_OPTIONS);
    res.status(200).json({
      success: true,
      data: { accessToken: tokens.accessToken },
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    await authService.logout(req.user?._id, refreshToken);
    res.clearCookie('refreshToken', { httpOnly: true, secure: config.nodeEnv === 'production', sameSite: 'strict' });
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    next(err);
  }
};

const logoutAll = async (req, res, next) => {
  try {
    await authService.logoutAll(req.user._id);
    res.clearCookie('refreshToken', { httpOnly: true, secure: config.nodeEnv === 'production', sameSite: 'strict' });
    res.status(200).json({
      success: true,
      message: 'Logged out from all devices',
    });
  } catch (err) {
    next(err);
  }
};

const me = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: { user: req.user },
    });
  } catch (err) {
    next(err);
  }
};

const saveFacebookToken = async (req, res, next) => {
  try {
    const { accessToken, pageId } = req.body;
    await req.user.updateOne({ 
      $set: { 
        facebookAccessToken: accessToken, 
        facebookPageId: pageId 
      } 
    });
    
    // Fetch updated user to return
    const updatedUser = await req.user.constructor.findById(req.user._id);
    
    res.status(200).json({
      success: true,
      message: 'Facebook integration connected successfully',
      data: { user: updatedUser },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  me,
  saveFacebookToken,
};
