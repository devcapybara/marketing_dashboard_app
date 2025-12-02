const listAdAccountsService = require('../../services/adAccount/listAdAccountsService');

async function listAdAccountsController(req, res, next) {
  try {
    const user = req.user;
    const { clientId, platform, isActive } = req.query;

    let filters = { platform, isActive };

    // Determine clientId based on user role
    if (user.role === 'CLIENT') {
      filters.clientId = user.clientId;
    } else if (user.role === 'ADMIN') {
      if (clientId) {
        // Verify admin has access to this client
        const hasAccess = user.managedClientIds.some(
          (id) => id.toString() === clientId.toString()
        );
        if (!hasAccess) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. You do not have permission to access this client.',
          });
        }
        filters.clientId = clientId;
      } else {
        // If no clientId specified, filter by managed clients
        if (user.managedClientIds.length > 0) {
          filters.clientIds = user.managedClientIds;
        }
      }
    } else if (user.role === 'SUPER_ADMIN') {
      if (clientId) {
        filters.clientId = clientId;
      }
    }

    const adAccounts = await listAdAccountsService(filters);

    // Filter by managedClientIds for ADMIN if no specific clientId
    if (user.role === 'ADMIN' && !clientId && user.managedClientIds.length > 0) {
      const filteredAccounts = adAccounts.filter((account) =>
        user.managedClientIds.some((id) => id.toString() === account.clientId._id.toString())
      );
      return res.status(200).json({
        success: true,
        message: 'Ad accounts retrieved successfully',
        data: filteredAccounts,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Ad accounts retrieved successfully',
      data: adAccounts,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = listAdAccountsController;

