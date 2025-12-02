const Topup = require('../../models/Topup');

async function updateTopupService(topupId, topupData) {
  try {
    const {
      platform,
      date,
      amount,
      paymentMethod,
      notes,
      receiptUrl,
    } = topupData;

    const topup = await Topup.findById(topupId);

    if (!topup) {
      throw new Error('Topup not found');
    }

    if (platform) topup.platform = platform;
    if (date) topup.date = date;
    if (amount !== undefined) topup.amount = amount;
    if (paymentMethod) topup.paymentMethod = paymentMethod;
    if (notes !== undefined) topup.notes = notes;
    if (receiptUrl !== undefined) topup.receiptUrl = receiptUrl;

    await topup.save();

    return topup;
  } catch (error) {
    throw error;
  }
}

module.exports = updateTopupService;

