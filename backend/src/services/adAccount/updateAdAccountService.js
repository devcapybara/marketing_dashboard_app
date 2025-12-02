const AdAccount = require('../../models/AdAccount');

async function updateAdAccountService(adAccountId, adAccountData) {
  try {
    const { platform, accountName, accountId, currency, isActive } = adAccountData;

    const adAccount = await AdAccount.findById(adAccountId);

    if (!adAccount) {
      throw new Error('Ad account not found');
    }

    if (platform) adAccount.platform = platform;
    if (accountName) adAccount.accountName = accountName;
    if (accountId) adAccount.accountId = accountId;
    if (currency) adAccount.currency = currency;
    if (isActive !== undefined) adAccount.isActive = isActive;

    await adAccount.save();

    return adAccount;
  } catch (error) {
    throw error;
  }
}

module.exports = updateAdAccountService;

