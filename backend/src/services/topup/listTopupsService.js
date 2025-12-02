const Topup = require('../../models/Topup');

async function listTopupsService(filters = {}) {
  try {
    const { clientId, adAccountId, platform, dateFrom, dateTo } = filters;

    const query = {};

    if (clientId) {
      query.clientId = clientId;
    }

    if (adAccountId) {
      query.adAccountId = adAccountId;
    }

    if (platform) {
      query.platform = platform;
    }

    if (dateFrom || dateTo) {
      query.date = {};
      if (dateFrom) {
        query.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.date.$lte = new Date(dateTo);
      }
    }

    const topups = await Topup.find(query)
      .populate('clientId', 'name companyName')
      .populate('adAccountId', 'accountName accountId')
      .populate('createdBy', 'name email')
      .sort({ date: -1 });

    return topups;
  } catch (error) {
    throw new Error('Failed to list topups');
  }
}

module.exports = listTopupsService;

