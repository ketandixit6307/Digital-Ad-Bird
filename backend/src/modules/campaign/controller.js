const campaignService = require('./service');

const getAll = async (req, res, next) => {
  try { res.json({ success: true, data: await campaignService.getAll(req.user._id, req.query) }); }
  catch (err) { next(err); }
};
const getById = async (req, res, next) => {
  try { res.json({ success: true, data: await campaignService.getById(req.params.id, req.user._id) }); }
  catch (err) { next(err); }
};
const create = async (req, res, next) => {
  try { res.status(201).json({ success: true, data: await campaignService.create({ ...req.body, userId: req.user._id }) }); }
  catch (err) { next(err); }
};
const update = async (req, res, next) => {
  try { res.json({ success: true, data: await campaignService.update(req.params.id, req.user._id, req.body) }); }
  catch (err) { next(err); }
};
const remove = async (req, res, next) => {
  try { await campaignService.remove(req.params.id, req.user._id); res.json({ success: true, message: 'Campaign deleted' }); }
  catch (err) { next(err); }
};
const launch = async (req, res, next) => {
  try { res.json({ success: true, data: await campaignService.launch(req.params.id, req.user._id) }); }
  catch (err) { next(err); }
};
const cancel = async (req, res, next) => {
  try { res.json({ success: true, data: await campaignService.cancel(req.params.id, req.user._id) }); }
  catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove, launch, cancel };
