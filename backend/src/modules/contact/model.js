const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  tags: [{ type: String, trim: true }],
  status: { type: String, enum: ['active', 'opt_out'], default: 'active' },
  source: { type: String, enum: ['manual', 'csv', 'whatsapp', 'facebook', 'api'], default: 'manual' },
  customAttributes: { type: Map, of: String, default: new Map() },
}, { timestamps: true });

contactSchema.index({ userId: 1, phone: 1 }, { unique: true });
contactSchema.index({ userId: 1, tags: 1 });
contactSchema.index({ userId: 1, name: 'text', phone: 'text', email: 'text' });

module.exports = mongoose.model('Contact', contactSchema);
