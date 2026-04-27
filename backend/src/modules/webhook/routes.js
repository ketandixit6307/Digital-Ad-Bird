const express = require('express');
const router = express.Router();
const Contact = require('../contact/model');
const Message = require('../message/model');
const User = require('../user/model');
const stripeService = require('../../services/stripeService');
const socketService = require('../../services/socketService');
const logger = require('../../config/logger');
const config = require('../../config');

// WhatsApp webhook
router.post('/whatsapp', async (req, res, next) => {
  try {
    // Support both standard WhatsApp API and simpler simulation payloads
    const from = req.body.from || req.body.phone;
    const body = req.body.body || req.body.message;
    const to = req.body.to || 'business';
    const profileName = req.body.profileName || 'Simulated User';

    if (!from || !body) return res.status(400).json({ success: false, message: 'Phone and message are required' });

    // Find or create contact
    let contact = await Contact.findOne({ phone: from });
    if (!contact) {
      contact = await Contact.create({
        userId: req.body.userId || null,
        name: profileName || from,
        phone: from,
        source: 'whatsapp',
      });
    }

    const message = await Message.create({
      userId: contact.userId,
      contactId: contact._id,
      from,
      to,
      direction: 'inbound',
      content: body,
      status: 'received',
      channel: 'whatsapp',
      metadata: req.body,
    });

    if (contact.userId) {
      socketService.emitToUser(contact.userId.toString(), 'message:received', message);
      
      // Execute Advanced Automation & AI logic
      const automationService = require('../automation/automationService');
      await automationService.processAutomation(contact.userId, contact, body);
    }

    res.status(200).json({ success: true, message: 'Message processed', data: message });
  } catch (err) { next(err); }
});

// Facebook Leads webhook
router.post('/facebook', async (req, res, next) => {
  try {
    // Support both complex Meta entry structure and simpler simulation payloads
    if (req.body.name && req.body.phone) {
      // Simple Simulation Path
      let targetUser = await User.findOne().sort({ updatedAt: -1 });
      
      const contact = await Contact.create({
        userId: targetUser ? targetUser._id : null,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email || '',
        source: 'facebook',
        tags: ['facebook_lead', 'simulation'],
      });
      
      return res.status(201).json({ success: true, message: 'Lead created', data: contact });
    }

    // Standard Meta Webhook Path
    const { entry } = req.body;
    if (!entry) return res.sendStatus(200);

    for (const e of entry) {
      const pageId = e.id;
      let targetUser = await User.findOne({ facebookPageId: pageId });
      
      if (!targetUser) {
        targetUser = await User.findOne().sort({ updatedAt: -1 });
      }

      for (const change of (e.changes || [])) {
        if (change.value && change.value.leadgen_id) {
          const lead = change.value;
          await Contact.create({
            userId: targetUser ? targetUser._id : null,
            name: lead.full_name || 'Facebook Lead',
            phone: lead.phone_number || '+10000000000',
            email: lead.email || '',
            source: 'facebook',
            tags: ['facebook_lead'],
          });
        }
      }
    }
    res.sendStatus(200);
  } catch (err) { next(err); }
});

// Stripe webhook
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripeService.constructEvent(req.body, sig);
    } catch (err) {
      logger.error('Stripe webhook error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const planSlug = session.metadata?.planSlug;
      if (userId) {
        await User.findByIdAndUpdate(userId, {
          subscriptionStatus: 'active',
          stripeCustomerId: session.customer,
          currentPlan: planSlug || 'basic',
        });
      }
    }

    if (event.type === 'invoice.payment_failed') {
      const session = event.data.object;
      if (session.customer) {
        await User.updateOne({ stripeCustomerId: session.customer }, { subscriptionStatus: 'inactive' });
      }
    }

    res.json({ received: true });
  } catch (err) { next(err); }
});

module.exports = router;
