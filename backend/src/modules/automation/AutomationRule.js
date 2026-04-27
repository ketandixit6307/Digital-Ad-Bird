const mongoose = require('mongoose');

const automationRuleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  keyword: { type: String, required: true, trim: true },
  replyMessage: { type: String, required: true },
  matchType: { type: String, enum: ['exact', 'includes'], default: 'exact' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

automationRuleSchema.index({ userId: 1, keyword: 1 });

module.exports = mongoose.model('AutomationRule', automationRuleSchema);
