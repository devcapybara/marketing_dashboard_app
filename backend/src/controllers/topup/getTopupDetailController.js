const getTopupByIdService = require('../../services/topup/getTopupByIdService');

async function getTopupDetailController(req, res, next) {
  try {
    const { id } = req.params;

    const topup = await getTopupByIdService(id);

    if (!topup) {
      return res.status(404).json({
        success: false,
        message: 'Topup not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Topup retrieved successfully',
      data: topup,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = getTopupDetailController;

