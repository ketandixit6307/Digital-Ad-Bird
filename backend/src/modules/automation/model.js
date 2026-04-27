const mongoose = require('mongoose');

const automationFlowSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  trigger: {
    type: { type: String, enum: ['event', 'schedule', 'message_received', 'campaign_completed', 'contact_added'], required: true },
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  conditions: [{
    field: { type: String },
    operator: { type: String, enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'exists'] },
    value: { type: mongoose.Schema.Types.Mixed },
  }],
  actions: [{
    type: { type: String, enum: ['send_message', 'add_tag', 'remove_tag', 'update_contact', 'start_campaign', 'notify_user', 'webhook'], required: true },
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
  }],
  status: { type: String, enum: ['active', 'paused', 'draft'], default: 'draft' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

automationFlowSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('AutomationFlow', automationFlowSchema);
