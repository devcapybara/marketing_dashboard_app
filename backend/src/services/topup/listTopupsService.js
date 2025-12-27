const Topup = require('../../models/Topup');

async function listTopupsService(filters = {}) {
  try {
    const { clientId, adAccountId, platform, dateFrom, dateTo, page = 1, limit = 25 } = filters;

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

    const total = await Topup.countDocuments(query);
    const skip = Math.max(0, (parseInt(page) - 1) * parseInt(limit));
    const topups = await Topup.find(query)
      .populate('clientId', 'name companyName')
      .populate('adAccountId', 'accountName accountId')
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return { topups, total };
  } catch (error) {
    throw new Error('Failed to list topups');
  }
}

module.exports = listTopupsService;

