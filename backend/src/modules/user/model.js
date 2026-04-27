const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'agent'], default: 'agent' },
  organization: { type: String, trim: true },
  phone: { type: String, trim: true },
  industry: { type: String, trim: true },
  size: { type: String, trim: true },
  refreshTokens: [{ token: String, createdAt: { type: Date, default: Date.now } }],
  subscriptionStatus: { type: String, enum: ['active', 'inactive', 'trial'], default: 'trial' },
  stripeCustomerId: { type: String },
  stripeSubscriptionId: { type: String },
  currentPlan: { type: String, enum: ['basic', 'pro', 'none'], default: 'none' },
  facebookAccessToken: { type: String, default: null },
  facebookPageId: { type: String, default: null },
}, { timestamps: true });

userSchema.index({ stripeCustomerId: 1 });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
