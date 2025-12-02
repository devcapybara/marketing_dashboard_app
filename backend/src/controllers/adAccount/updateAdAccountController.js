const updateAdAccountService = require('../../services/adAccount/updateAdAccountService');

async function updateAdAccountController(req, res, next) {
  try {
    const { id } = req.params;
    const { platform, accountName, accountId, currency, isActive } = req.body;

    const adAccountData = {
      platform,
      accountName,
      accountId,
      currency,
      isActive,
    };

    const updatedAdAccount = await updateAdAccountService(id, adAccountData);

    return res.status(200).json({
      success: true,
      message: 'Ad account updated successfully',
      data: updatedAdAccount,
    });
  } catch (error) {
    if (error.message === 'Ad account not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

module.exports = updateAdAccountController;

