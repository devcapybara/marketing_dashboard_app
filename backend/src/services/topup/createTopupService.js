const Topup = require('../../models/Topup');

async function createTopupService(topupData) {
  try {
    const {
      clientId,
      adAccountId,
      platform,
      date,
      amount,
      paymentMethod,
      notes,
      receiptUrl,
      createdBy,
    } = topupData;

    const topup = new Topup({
      clientId,
      adAccountId,
      platform,
      date,
      amount,
      paymentMethod: paymentMethod || 'BANK_TRANSFER',
      notes,
      receiptUrl,
      createdBy,
    });

    await topup.save();

    return topup;
  } catch (error) {
    throw error;
  }
}

module.exports = createTopupService;

