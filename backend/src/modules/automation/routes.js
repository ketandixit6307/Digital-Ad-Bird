const express = require('express');
const router = express.Router();
const controller = require('./automationController');
const { authenticate } = require('../../middleware/auth');

router.use(authenticate);

router.get('/', controller.getRules);
router.post('/', controller.createRule);
router.put('/:id', controller.updateRule);
router.delete('/:id', controller.deleteRule);

module.exports = router;
