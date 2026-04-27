const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('./controller');
const { authenticate } = require('../../middleware/auth');

const upload = multer({ dest: 'uploads/' });

router.get('/', authenticate, controller.getAll);
router.get('/tags', authenticate, controller.getTags);
router.post('/', authenticate, controller.create);
router.post('/import-csv', authenticate, upload.single('file'), controller.importCSV);
router.get('/:id', authenticate, controller.getById);
router.get('/:id/messages', authenticate, controller.getMessages);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, controller.remove);

module.exports = router;
