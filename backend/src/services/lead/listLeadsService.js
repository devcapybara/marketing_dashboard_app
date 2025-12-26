const Lead = require('../../models/Lead');
const mongoose = require('mongoose');

async function listLeadsService(clientId, { page = 1, limit = 25 } = {}) {
  if (!clientId) return { leads: [], total: 0 };
  const isValid = mongoose.Types.ObjectId.isValid(clientId);
  const query = isValid ? { clientId: new mongoose.Types.ObjectId(clientId) } : { clientId };
  const total = await Lead.countDocuments(query);
  const skip = Math.max(0, (parseInt(page) - 1) * parseInt(limit));
  const leads = await Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));
  return { leads, total };
}

module.exports = listLeadsService;
