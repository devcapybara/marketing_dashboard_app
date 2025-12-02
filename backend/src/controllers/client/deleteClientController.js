const deleteClientService = require('../../services/client/deleteClientService');

async function deleteClientController(req, res, next) {
  try {
    const { id } = req.params;

    await deleteClientService(id);

    return res.status(200).json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    if (error.message === 'Client not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

module.exports = deleteClientController;

