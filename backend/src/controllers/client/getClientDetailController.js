const getClientByIdService = require('../../services/client/getClientByIdService');

async function getClientDetailController(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;

    const client = await getClientByIdService(id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found',
      });
    }

    // Authorization check
    const isSuperAdmin = user.role === 'SUPER_ADMIN';
    const isAdminManagingClient = user.role === 'ADMIN' && user.managedClientIds.some(managedId => managedId.toString() === id);
    const isClientOwner = user.role === 'CLIENT' && user.clientId.toString() === id;

    if (!isSuperAdmin && !isAdminManagingClient && !isClientOwner) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
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

