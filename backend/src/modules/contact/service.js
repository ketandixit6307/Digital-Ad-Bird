const Contact = require('./model');
const { AppError } = require('../../middleware/errorHandler');
const csv = require('csv-parser');
const fs = require('fs');

const getAll = async (userId, query) => {
  const mongoose = require('mongoose');

  // Fallback for DEMO mode if MongoDB is not connected
  if (mongoose.connection.readyState !== 1) {
    console.warn('MongoDB not connected — using DEMO mode fallback for contacts');
    return {
      contacts: [
        { _id: '507f1f77bcf86cd799439012', name: 'Ketan Dixit', phone: '+919999999999', userId, tags: ['demo', 'prospect'], status: 'active' },
        { _id: '507f1f77bcf86cd799439013', name: 'John Doe', phone: '+1234567890', userId, tags: ['customer'], status: 'active' },
        { _id: '507f1f77bcf86cd799439014', name: 'Jane Smith', phone: '+1987654321', userId, tags: ['lead'], status: 'active' },
      ],
      total: 3,
      page: 1,
      pages: 1
    };
  }

  const { page = 1, limit = 20, search, tag, status } = query;
  const filter = { userId };

  if (status) filter.status = status;
  if (tag) filter.tags = tag;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [contacts, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Contact.countDocuments(filter),
  ]);

  return { contacts, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) };
};

const getById = async (id, userId) => {
  const contact = await Contact.findOne({ _id: id, userId });
  if (!contact) throw new AppError('Contact not found', 404, 'NOT_FOUND');
  return contact;
};

const create = async (data) => {
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) {
    console.warn('MongoDB not connected — using DEMO mode fallback for creating contact');
    return {
      _id: 'mock_contact_' + Date.now(),
      ...data,
      status: 'active',
      createdAt: new Date(),
    };
  }
  return Contact.create(data);
};

const update = async (id, userId, data) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: id, userId },
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!contact) throw new AppError('Contact not found', 404, 'NOT_FOUND');
  return contact;
};

const remove = async (id, userId) => {
  const contact = await Contact.findOneAndDelete({ _id: id, userId });
  if (!contact) throw new AppError('Contact not found', 404, 'NOT_FOUND');
  return contact;
};

const importCSV = async (file, userId) => {
  if (!file) throw new AppError('No file uploaded', 400, 'VALIDATION_ERROR');

  const results = [];
  const errors = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        let created = 0;
        for (const row of results) {
          try {
            const contactData = {
              userId,
              name: row.name || row.Name || 'Unknown',
              phone: row.phone || row.Phone || row.mobile || row.Mobile,
              email: row.email || row.Email,
              tags: (row.tags || row.Tags || '').split(',').filter(Boolean).map(t => t.trim()),
              source: 'csv',
            };
            if (contactData.phone) {
              await Contact.create(contactData);
              created++;
            }
          } catch (err) {
            errors.push({ row, error: err.message });
          }
        }
        fs.unlinkSync(file.path);
        resolve({ imported: created, total: results.length, errors: errors.length });
      })
      .on('error', reject);
  });
};

const getTags = async (userId) => {
  const contacts = await Contact.find({ userId });
  const tagSet = new Set();
  contacts.forEach(c => c.tags.forEach(t => tagSet.add(t)));
  return Array.from(tagSet);
};

const getMessages = async (id, userId) => {
  const Message = require('../message/model');
  return Message.find({ contactId: id, userId }).sort({ createdAt: 1 });
};

module.exports = { getAll, getById, create, update, remove, importCSV, getTags, getMessages };
