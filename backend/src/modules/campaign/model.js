const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  targetTags: [{ type: String, trim: true }],
  messageTemplate: { type: String, required: true },
  scheduledAt: { type: Date },
  status: { type: String, enum: ['draft', 'scheduled', 'processing', 'completed', 'failed', 'cancelled'], default: 'draft' },
  stats: {
    total: { type: Number, default: 0 },
    sent: { type: Number, default: 0 },
    delivered: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    read: { type: Number, default: 0 },
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

campaignSchema.index({ userId: 1, status: 1 });
campaignSchema.index({ status: 1, scheduledAt: 1 });

module.exports = mongoose.model('Campaign', campaignSchema);
