const AdAccount = require('../../models/AdAccount');

async function getAdAccountByIdService(adAccountId) {
  try {
    const adAccount = await AdAccount.findById(adAccountId)
      .populate('clientId', 'name companyName');
    return adAccount;
  } catch (error) {
    throw new Error('Failed to get ad account by ID');
  }
}

module.exports = getAdAccountByIdService;

