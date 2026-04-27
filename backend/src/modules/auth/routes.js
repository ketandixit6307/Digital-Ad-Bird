const express = require('express');
const router = express.Router();
const controller = require('./controller');
const validate = require('../../middleware/validate');
const { authenticate } = require('../../middleware/auth');
const { authLimiter } = require('../../middleware/rateLimiter');
const { registerSchema, loginSchema, refreshSchema } = require('./validation');

router.post('/register', authLimiter, validate(registerSchema), controller.register);
router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/refresh', validate(refreshSchema), controller.refresh);
router.post('/logout', authenticate, controller.logout);
router.post('/logout-all', authenticate, controller.logoutAll);
router.get('/me', authenticate, controller.me);
router.post('/facebook-token', authenticate, controller.saveFacebookToken);

module.exports = router;
