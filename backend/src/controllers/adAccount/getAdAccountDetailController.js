const getAdAccountByIdService = require('../../services/adAccount/getAdAccountByIdService');

async function getAdAccountDetailController(req, res, next) {
  try {
    const { id } = req.params;

    const adAccount = await getAdAccountByIdService(id);

    if (!adAccount) {
      return res.status(404).json({
        success: false,
        message: 'Ad account not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Ad account retrieved successfully',
      data: adAccount,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = getAdAccountDetailController;

