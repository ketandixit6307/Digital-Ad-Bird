const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { authenticate } = require('../../middleware/auth');

router.get('/', authenticate, controller.getAll);
router.post('/', authenticate, controller.create);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.remove);
router.post('/:id/launch', authenticate, controller.launch);
router.post('/:id/cancel', authenticate, controller.cancel);

module.exports = router;
