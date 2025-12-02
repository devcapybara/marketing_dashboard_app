const deleteTopupService = require('../../services/topup/deleteTopupService');

async function deleteTopupController(req, res, next) {
  try {
    const { id } = req.params;

    await deleteTopupService(id);

    return res.status(200).json({
      success: true,
      message: 'Topup deleted successfully',
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

module.exports = deleteTopupController;

