const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const { PLANS } = require('../../utils/constants');
const stripeService = require('../../services/stripeService');
const User = require('../user/model');
const { AppError } = require('../../middleware/errorHandler');

router.get('/plans', async (req, res, next) => {
  try {
    res.json({ success: true, data: Object.values(PLANS) });
  } catch (err) { next(err); }
});

router.post('/checkout', authenticate, async (req, res, next) => {
  try {
    const { planSlug } = req.body;
    const plan = Object.values(PLANS).find(p => p.slug === planSlug);
    if (!plan) throw new AppError('Plan not found', 404, 'NOT_FOUND');
    const priceId = planSlug === 'basic' ? require('../../config').stripe.priceBasic : require('../../config').stripe.pricePro;
    const session = await stripeService.createCheckoutSession({
      customerEmail: req.user.email,
      priceId,
      userId: req.user._id.toString(),
      planSlug,
    });
    res.json({ success: true, data: { url: session.url } });
  } catch (err) { next(err); }
});

router.post('/simulate-payment', authenticate, async (req, res, next) => {
  try {
    const { planSlug } = req.body;
    const plan = Object.values(PLANS).find(p => p.slug === planSlug);
    if (!plan) throw new AppError('Plan not found', 404, 'NOT_FOUND');
    
    req.user.currentPlan = planSlug;
    req.user.subscriptionStatus = 'active';
    await req.user.save();
    
    res.json({ success: true, data: { user: req.user } });
  } catch (err) { next(err); }
});

router.post('/portal', authenticate, async (req, res, next) => {
  try {
    if (!req.user.stripeCustomerId) throw new AppError('No subscription found', 400, 'NO_SUBSCRIPTION');
    const session = await stripeService.createCustomerPortalSession(req.user.stripeCustomerId);
    res.json({ success: true, data: { url: session.url } });
  } catch (err) { next(err); }
});

module.exports = router;
