const express = require('express');
const router = express.Router();

router.use('/auth', require('../modules/auth/routes'));
router.use('/contacts', require('../modules/contact/routes'));
router.use('/campaigns', require('../modules/campaign/routes'));
router.use('/messages', require('../modules/message/routes'));
router.use('/templates', require('../modules/template/routes'));
router.use('/billing', require('../modules/subscription/routes'));
router.use('/automation', require('../modules/automation/routes'));
router.use('/dashboard', require('../modules/dashboard/routes'));
router.use('/webhooks', require('../modules/webhook/routes'));

module.exports = router;
