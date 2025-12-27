const AdAccount = require('../../models/AdAccount');

async function createAdAccountService(adAccountData) {
  try {
    const { clientId, platform, accountName, accountId, currency, vatPercent } = adAccountData;

    const adAccount = new AdAccount({
      clientId,
      platform,
      accountName,
      accountId,
      currency: currency || 'IDR',
      vatPercent: typeof vatPercent === 'number' ? vatPercent : 11,
      isActive: true,
    });

    await adAccount.save();

    return adAccount;
  } catch (error) {
    throw error;
  }
}

module.exports = createAdAccountService;

