const { Queue, Worker } = require('bullmq');
const redis = require('../config/redis');
const config = require('../config');
const logger = require('../config/logger');
const Campaign = require('../modules/campaign/model');
const Message = require('../modules/message/model');
const Contact = require('../modules/contact/model');
const socketService = require('./socketService');

let campaignQueue = null;

try {
  if (redis) {
    campaignQueue = new Queue('campaignQueue', {
      connection: redis,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 50 },
      },
    });
    campaignQueue.on('error', (err) => {
      logger.warn('BullMQ Queue connection error: ' + err.message);
    });
  }
} catch (err) {
  logger.warn('BullMQ Queue init skipped — Redis not available');
}

const createCampaignWorker = () => {
  if (!redis) {
    logger.warn('Campaign worker not started — Redis not available');
    return null;
  }

  const worker = new Worker('campaignQueue', async (job) => {
    const { campaignId, userId } = job.data;
    logger.info(`Processing campaign ${campaignId}`);

    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.status === 'cancelled') {
      logger.warn(`Campaign ${campaignId} not found or cancelled`);
      return;
    }

    // Find target contacts
    const query = { userId, status: 'active' };
    if (campaign.targetTags && campaign.targetTags.length > 0) {
      query.tags = { $in: campaign.targetTags };
    }
    const contacts = await Contact.find(query);

    campaign.status = 'processing';
    campaign.stats.total = contacts.length;
    await campaign.save();

    socketService.emitToUser(userId.toString(), 'campaign:progress', {
      campaignId: campaign._id,
      status: 'processing',
      total: contacts.length,
      sent: 0,
      failed: 0,
    });

    let sent = 0;
    let failed = 0;

    for (const contact of contacts) {
      try {
        // Simulate message sending
        await new Promise(resolve => setTimeout(resolve, 100));

        await Message.create({
          userId,
          contactId: contact._id,
          from: 'business',
          to: contact.phone,
          direction: 'outbound',
          content: campaign.messageTemplate,
          status: 'sent',
          channel: 'whatsapp',
        });

        sent++;
      } catch (err) {
        failed++;
        logger.error(`Failed to send message to ${contact.phone}:`, err.message);
      }

      // Emit progress every 10 messages
      if ((sent + failed) % 10 === 0 || (sent + failed) === contacts.length) {
        campaign.stats.sent = sent;
        campaign.stats.failed = failed;
        await campaign.save();

        socketService.emitToUser(userId.toString(), 'campaign:progress', {
          campaignId: campaign._id,
          status: 'processing',
          total: contacts.length,
          sent,
          failed,
        });
      }
    }

    campaign.status = failed === contacts.length ? 'failed' : 'completed';
    campaign.stats.sent = sent;
    campaign.stats.failed = failed;
    await campaign.save();

    socketService.emitToUser(userId.toString(), 'campaign:progress', {
      campaignId: campaign._id,
      status: campaign.status,
      total: contacts.length,
      sent,
      failed,
    });

    logger.info(`Campaign ${campaignId} completed. Sent: ${sent}, Failed: ${failed}`);
  }, { connection: redis });

  worker.on('error', (err) => {
    logger.warn('BullMQ Worker connection error: ' + err.message);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Campaign job ${job.id} failed:`, err.message);
  });

  return worker;
};

const addCampaignJob = async (campaignId, userId, delay = 0) => {
  if (!campaignQueue) {
    logger.warn('Cannot add campaign job — queue not available');
    return null;
  }
  await campaignQueue.add('sendCampaign', { campaignId, userId }, { delay });
};

module.exports = {
  campaignQueue,
  createCampaignWorker,
  addCampaignJob,
};
