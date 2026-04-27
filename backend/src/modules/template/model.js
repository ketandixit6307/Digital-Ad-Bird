const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  variables: [{ type: String, trim: true }],
  category: { type: String, enum: ['marketing', 'utility', 'authentication', 'generic'], default: 'marketing' },
  status: { type: String, enum: ['draft', 'approved', 'rejected'], default: 'draft' },
  language: { type: String, default: 'en' },
}, { timestamps: true });

templateSchema.index({ userId: 1, name: 'text' });

module.exports = mongoose.model('Template', templateSchema);
