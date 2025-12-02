const listClientsService = require('../../services/client/listClientsService');

async function listClientsController(req, res, next) {
  try {
    const user = req.user;
    const { status, search } = req.query;

    let filters = { status, search };

    // SUPER_ADMIN can see all clients
    // ADMIN can only see clients they manage
    if (user.role === 'ADMIN' && user.managedClientIds.length > 0) {
      filters.clientIds = user.managedClientIds;
    }

    // CLIENT can only see their own client
    if (user.role === 'CLIENT' && user.clientId) {
      filters.clientId = user.clientId;
    }

    const clients = await listClientsService(filters);

    // Filter by managedClientIds for ADMIN
    if (user.role === 'ADMIN' && user.managedClientIds.length > 0) {
      const filteredClients = clients.filter((client) =>
        user.managedClientIds.some((id) => id.toString() === client._id.toString())
      );
      return res.status(200).json({
        success: true,
        message: 'Clients retrieved successfully',
        data: filteredClients,
      });
    }

    // Filter by clientId for CLIENT
    if (user.role === 'CLIENT' && user.clientId) {
      const filteredClients = clients.filter(
        (client) => client._id.toString() === user.clientId.toString()
      );
      return res.status(200).json({
        success: true,
        message: 'Client retrieved successfully',
        data: filteredClients,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Clients retrieved successfully',
      data: clients,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = listClientsController;

