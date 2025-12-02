const updateTopupService = require('../../services/topup/updateTopupService');

async function updateTopupController(req, res, next) {
  try {
    const { id } = req.params;
    const {
      platform,
      date,
      amount,
      paymentMethod,
      notes,
      receiptUrl,
    } = req.body;

    const topupData = {
      platform,
      date,
      amount,
      paymentMethod,
      notes,
      receiptUrl,
    };

    const updatedTopup = await updateTopupService(id, topupData);

    return res.status(200).json({
      success: true,
      message: 'Topup updated successfully',
      data: updatedTopup,
    });
  } catch (error) {
    if (error.message === 'Topup not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

module.exports = updateTopupController;

