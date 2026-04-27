const Campaign = require('./model');
const { AppError } = require('../../middleware/errorHandler');
const { addCampaignJob } = require('../../services/queueService');

const getAll = async (userId, query) => {
  const { page = 1, limit = 20, status } = query;
  const filter = { userId };
  if (status) filter.status = status;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [campaigns, total] = await Promise.all([
    Campaign.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Campaign.countDocuments(filter),
  ]);
  return { campaigns, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) };
};

const getById = async (id, userId) => {
  const campaign = await Campaign.findOne({ _id: id, userId });
  if (!campaign) throw new AppError('Campaign not found', 404, 'NOT_FOUND');
  return campaign;
};

const create = async (data) => Campaign.create(data);

const update = async (id, userId, data) => {
  const campaign = await Campaign.findOneAndUpdate({ _id: id, userId }, { $set: data }, { new: true, runValidators: true });
  if (!campaign) throw new AppError('Campaign not found', 404, 'NOT_FOUND');
  return campaign;
};

const remove = async (id, userId) => {
  const campaign = await Campaign.findOneAndDelete({ _id: id, userId });
  if (!campaign) throw new AppError('Campaign not found', 404, 'NOT_FOUND');
  return campaign;
};

const launch = async (id, userId) => {
  const campaign = await Campaign.findOne({ _id: id, userId });
  if (!campaign) throw new AppError('Campaign not found', 404, 'NOT_FOUND');
  if (campaign.status === 'processing' || campaign.status === 'completed') {
    throw new AppError('Campaign already launched or completed', 400, 'INVALID_STATE');
  }
  campaign.status = 'scheduled';
  await campaign.save();
  const delay = campaign.scheduledAt ? new Date(campaign.scheduledAt).getTime() - Date.now() : 0;
  await addCampaignJob(campaign._id, userId, Math.max(0, delay));
  return campaign;
};

const cancel = async (id, userId) => {
  const campaign = await Campaign.findOneAndUpdate(
    { _id: id, userId, status: { $in: ['draft', 'scheduled'] } },
    { $set: { status: 'cancelled' } },
    { new: true }
  );
  if (!campaign) throw new AppError('Campaign not found or cannot be cancelled', 404, 'NOT_FOUND');
  return campaign;
};

module.exports = { getAll, getById, create, update, remove, launch, cancel };
