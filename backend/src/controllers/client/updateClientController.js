const updateClientService = require('../../services/client/updateClientService');

async function updateClientController(req, res, next) {
  try {
    const { id } = req.params;
    const { name, companyName, contactEmail, status } = req.body;

    const clientData = {
      name,
      companyName,
      contactEmail,
      status,
    };

    const updatedClient = await updateClientService(id, clientData);

    return res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: updatedClient,
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

module.exports = updateClientController;

