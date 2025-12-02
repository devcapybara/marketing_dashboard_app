const deleteAdAccountService = require('../../services/adAccount/deleteAdAccountService');

async function deleteAdAccountController(req, res, next) {
  try {
    const { id } = req.params;

    await deleteAdAccountService(id);

    return res.status(200).json({
      success: true,
      message: 'Ad account deleted successfully',
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

module.exports = deleteAdAccountController;

