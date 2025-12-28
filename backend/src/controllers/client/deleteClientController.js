const deleteClientService = require('../../services/client/deleteClientService');
const getClientByIdService = require('../../services/client/getClientByIdService');
const createAuditLogService = require('../../services/audit/createAuditLogService');

async function deleteClientController(req, res, next) {
  try {
    const { id } = req.params;

    const before = await getClientByIdService(id);
    await deleteClientService(id);

    await createAuditLogService({
      user: req.user,
      action: 'DELETE_CLIENT',
      targetModel: 'Client',
      targetId: id,
      details: { before },
      ipAddress: req.ip,
    });

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

