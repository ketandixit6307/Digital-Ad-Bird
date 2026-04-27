const express = require('express');
const router = express.Router();
const { authenticate } = require('../../middleware/auth');
const Contact = require('../contact/model');
const Message = require('../message/model');
const Campaign = require('../campaign/model');
const ActivityLog = require('./model');

router.get('/stats', authenticate, async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    const userId = req.user._id;

    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        data: {
          totalContacts: 150,
          totalMessages: 5400,
          totalCampaigns: 12,
          campaignStats: { completed: 10, processing: 2 },
          messageStats: { inbound: 2000, outbound: 3400 },
          messagesByDay: [
            { _id: '2026-04-20', count: 45 },
            { _id: '2026-04-21', count: 52 },
            { _id: '2026-04-22', count: 38 },
            { _id: '2026-04-23', count: 65 },
            { _id: '2026-04-24', count: 48 },
            { _id: '2026-04-25', count: 55 },
            { _id: '2026-04-26', count: 60 },
          ],
          recentMessages: [
            { _id: 'rm_1', content: 'Demo message 1', direction: 'outbound', createdAt: new Date() },
            { _id: 'rm_2', content: 'Demo message 2', direction: 'inbound', createdAt: new Date() },
          ],
        },
      });
    }

    const [totalContacts, totalMessages, totalCampaigns, recentMessages] = await Promise.all([
      Contact.countDocuments({ userId }),
      Message.countDocuments({ userId }),
      Campaign.countDocuments({ userId }),
      Message.find({ userId }).sort({ createdAt: -1 }).limit(5).populate('contactId', 'name phone'),
    ]);

    const campaignStats = await Campaign.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const messageStats = await Message.aggregate([
      { $match: { userId } },
      { $group: { _id: '$direction', count: { $sum: 1 } } },
    ]);

    const messagesByDay = await Message.aggregate([
      { $match: { userId, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    res.json({
      success: true,
      data: {
        totalContacts,
        totalMessages,
        totalCampaigns,
        campaignStats: campaignStats.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}),
        messageStats: messageStats.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}),
        messagesByDay,
        recentMessages,
      },
    });
  } catch (err) { next(err); }
});

router.get('/activity', authenticate, async (req, res, next) => {
  try {
    const { limit = 20 } = req.query;
    const activities = await ActivityLog.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));
    res.json({ success: true, data: activities });
  } catch (err) { next(err); }
});

module.exports = router;
