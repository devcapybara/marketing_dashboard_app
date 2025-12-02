const Client = require('../../models/Client');

async function listClientsService(filters = {}) {
  try {
    const { status, createdBy, search } = filters;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (createdBy) {
      query.createdBy = createdBy;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const clients = await Client.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    return clients;
  } catch (error) {
    throw new Error('Failed to list clients');
  }
}

module.exports = listClientsService;

