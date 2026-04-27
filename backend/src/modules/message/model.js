const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', index: true },
  from: { type: String, required: true, trim: true },
  to: { type: String, required: true, trim: true },
  direction: { type: String, enum: ['inbound', 'outbound'], required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['sent', 'delivered', 'read', 'failed', 'received'], default: 'sent' },
  channel: { type: String, enum: ['whatsapp', 'facebook', 'sms', 'email'], default: 'whatsapp' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

messageSchema.index({ userId: 1, contactId: 1, createdAt: -1 });
messageSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);
