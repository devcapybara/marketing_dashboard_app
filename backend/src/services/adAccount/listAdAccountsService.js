const AdAccount = require('../../models/AdAccount');

async function listAdAccountsService(filters = {}) {
  try {
    const { clientId, platform, isActive } = filters;

    const query = {};

    if (clientId) {
      query.clientId = clientId;
    }

    if (platform) {
      query.platform = platform;
    }

    if (isActive !== undefined) {
      query.isActive = isActive;
    }

    const adAccounts = await AdAccount.find(query)
      .populate('clientId', 'name companyName')
      .sort({ createdAt: -1 });

    return adAccounts;
  } catch (error) {
    throw new Error('Failed to list ad accounts');
  }
}

module.exports = listAdAccountsService;

