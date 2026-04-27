const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const Template = require('./model');
const { AppError } = require('../../middleware/errorHandler');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const templates = await Template.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: templates });
  } catch (err) { next(err); }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const template = await Template.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, data: template });
  } catch (err) { next(err); }
});

router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const template = await Template.findOne({ _id: req.params.id, userId: req.user._id });
    if (!template) throw new AppError('Template not found', 404, 'NOT_FOUND');
    res.json({ success: true, data: template });
  } catch (err) { next(err); }
});

router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const template = await Template.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, req.body, { new: true });
    if (!template) throw new AppError('Template not found', 404, 'NOT_FOUND');
    res.json({ success: true, data: template });
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await Template.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ success: true, message: 'Template deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
