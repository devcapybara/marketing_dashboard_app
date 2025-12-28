const updateClientService = require('../../services/client/updateClientService');
const getClientByIdService = require('../../services/client/getClientByIdService');
const createAuditLogService = require('../../services/audit/createAuditLogService');

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

    const before = await getClientByIdService(id);
    const updatedClient = await updateClientService(id, clientData);

    await createAuditLogService({
      user: req.user,
      action: 'UPDATE_CLIENT',
      targetModel: 'Client',
      targetId: updatedClient._id,
      details: { before, after: updatedClient },
      ipAddress: req.ip,
    });

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

