const Topup = require('../../models/Topup');

async function getTopupByIdService(topupId) {
  try {
    const topup = await Topup.findById(topupId)
      .populate('clientId', 'name companyName')
      .populate('adAccountId', 'accountName accountId platform')
      .populate('createdBy', 'name email');
    return topup;
  } catch (error) {
    throw new Error('Failed to get topup by ID');
  }
}

module.exports = getTopupByIdService;

