const AuditLog = require('../../models/AuditLog');
const User = require('../../models/User');
const mongoose = require('mongoose');

async function listAuditLogsService({ page = 1, limit = 20, filters = {} }) {
  const query = {};

  // Handle user filtering by email or userId
  if (filters.userId && mongoose.Types.ObjectId.isValid(filters.userId)) {
    query.user = filters.userId;
  } else if (filters.email) {
    const user = await User.findOne({ email: filters.email }).select('_id');
    // If a user is found, use their ID for the query.
    // If not found, create a condition that will yield no results.
    query.user = user ? user._id : new mongoose.Types.ObjectId();
  }

  if (filters.action) {
    query.action = { $regex: filters.action, $options: 'i' };
  }
  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      query.createdAt.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      // Set to the end of the day
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      query.createdAt.$lte = endDate;
    }
  }

  const skip = (page - 1) * limit;
  const [items, totalItems] = await Promise.all([
    AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email role')
      .lean(),
    AuditLog.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalItems / limit) || 1;

  return {
    items,
    page,
    limit,
    totalItems,
    totalPages,
  };
}

module.exports = listAuditLogsService;
