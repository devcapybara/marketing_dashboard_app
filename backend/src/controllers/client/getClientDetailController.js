const getClientByIdService = require('../../services/client/getClientByIdService');

async function getClientDetailController(req, res, next) {
  try {
    const { id } = req.params;

    const client = await getClientByIdService(id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Client retrieved successfully',
      data: client,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = getClientDetailController;

