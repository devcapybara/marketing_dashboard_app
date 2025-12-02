const AdAccount = require('../../models/AdAccount');

async function deleteAdAccountService(adAccountId) {
  try {
    const adAccount = await AdAccount.findById(adAccountId);

    if (!adAccount) {
      throw new Error('Ad account not found');
    }

    await AdAccount.findByIdAndDelete(adAccountId);

    return { message: 'Ad account deleted successfully' };
  } catch (error) {
    throw error;
  }
}

module.exports = deleteAdAccountService;

