const Stripe = require('stripe');
const config = require('../config');
const logger = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');

// Lazy-initialize Stripe only when secret key is available
let stripeInstance = null;
const getStripe = () => {
  if (!config.stripe.secretKey) return null;
  if (!stripeInstance) stripeInstance = new Stripe(config.stripe.secretKey);
  return stripeInstance;
};

const createCheckoutSession = async ({ customerEmail, priceId, userId, planSlug }) => {
  const stripe = getStripe();
  if (!stripe) {
    throw new AppError('Stripe is not configured', 500, 'STRIPE_NOT_CONFIGURED');
  }

  const session = await stripe.checkout.sessions.create({
    customer_email: customerEmail,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${config.frontendUrl}/billing?success=true`,
    cancel_url: `${config.frontendUrl}/billing?canceled=true`,
    metadata: { userId, planSlug },
  });

  return session;
};

const createCustomerPortalSession = async (customerId) => {
  const stripe = getStripe();
  if (!stripe) {
    throw new AppError('Stripe is not configured', 500, 'STRIPE_NOT_CONFIGURED');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${config.frontendUrl}/billing`,
  });

  return session;
};

const constructEvent = (payload, signature) => {
  const stripe = getStripe();
  if (!stripe || !config.stripe.webhookSecret) {
    throw new AppError('Stripe webhook secret not configured', 500, 'STRIPE_NOT_CONFIGURED');
  }
  return stripe.webhooks.constructEvent(payload, signature, config.stripe.webhookSecret);
};

module.exports = {
  getStripe,
  createCheckoutSession,
  createCustomerPortalSession,
  constructEvent,
};
