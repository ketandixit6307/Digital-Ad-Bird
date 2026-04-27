const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true }, // in cents
  currency: { type: String, default: 'inr' },
  stripePriceId: { type: String },
  stripeProductId: { type: String },
  billingInterval: { type: String, enum: ['month', 'quarter', 'year'], default: 'month' },
  features: [{ type: String }],
  limits: {
    contacts: { type: Number, default: -1 }, // -1 = unlimited
    campaigns: { type: Number, default: -1 },
    messages: { type: Number, default: -1 },
    agents: { type: Number, default: 5 },
    tags: { type: Number, default: 10 },
    customAttributes: { type: Number, default: 5 },
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  stripeSubscriptionId: { type: String },
  stripeCustomerId: { type: String },
  status: { type: String, enum: ['active', 'cancelled', 'past_due', 'unpaid', 'trialing'], default: 'trialing' },
  currentPeriodStart: { type: Date },
  currentPeriodEnd: { type: Date },
  cancelAtPeriodEnd: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = {
  Plan: mongoose.model('Plan', planSchema),
  Subscription: mongoose.model('Subscription', subscriptionSchema),
};
