const contactService = require('./service');

const getAll = async (req, res, next) => {
  try {
    const result = await contactService.getAll(req.user._id, req.query);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const contact = await contactService.getById(req.params.id, req.user._id);
    res.json({ success: true, data: contact });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const contact = await contactService.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, data: contact });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const contact = await contactService.update(req.params.id, req.user._id, req.body);
    res.json({ success: true, data: contact });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await contactService.remove(req.params.id, req.user._id);
    res.json({ success: true, message: 'Contact deleted' });
  } catch (err) { next(err); }
};

const importCSV = async (req, res, next) => {
  try {
    const result = await contactService.importCSV(req.file, req.user._id);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

const getTags = async (req, res, next) => {
  try {
    const tags = await contactService.getTags(req.user._id);
    res.json({ success: true, data: tags });
  } catch (err) { next(err); }
};

const getMessages = async (req, res, next) => {
  try {
    const messages = await contactService.getMessages(req.params.id, req.user._id);
    res.json({ success: true, data: messages });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove, importCSV, getTags, getMessages };
