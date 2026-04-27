const AutomationRule = require('./AutomationRule');

const getRules = async (req, res, next) => {
  try {
    const rules = await AutomationRule.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: rules });
  } catch (err) { next(err); }
};

const createRule = async (req, res, next) => {
  try {
    const rule = await AutomationRule.create({
      ...req.body,
      userId: req.user._id
    });
    res.status(201).json({ success: true, data: rule });
  } catch (err) { next(err); }
};

const updateRule = async (req, res, next) => {
  try {
    const rule = await AutomationRule.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!rule) return res.status(404).json({ success: false, message: 'Rule not found' });
    res.json({ success: true, data: rule });
  } catch (err) { next(err); }
};

const deleteRule = async (req, res, next) => {
  try {
    const rule = await AutomationRule.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!rule) return res.status(404).json({ success: false, message: 'Rule not found' });
    res.json({ success: true, message: 'Rule deleted' });
  } catch (err) { next(err); }
};

module.exports = {
  getRules,
  createRule,
  updateRule,
  deleteRule
};
