const listTopupsService = require('../../services/topup/listTopupsService');

async function listTopupsController(req, res, next) {
  try {
    const user = req.user;
    const { clientId, adAccountId, platform, dateFrom, dateTo } = req.query;
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '25');

    let filters = { adAccountId, platform, dateFrom, dateTo, page, limit };

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

    const { topups, total } = await listTopupsService(filters);

    // Filter by managedClientIds for ADMIN if no specific clientId
    if (user.role === 'ADMIN' && !clientId && user.managedClientIds.length > 0) {
      const filteredTopups = topups.filter((topup) =>
        user.managedClientIds.some((id) => id.toString() === topup.clientId._id.toString())
      );
      return res.status(200).json({
        success: true,
        message: 'Topups retrieved successfully',
        data: filteredTopups,
        meta: { total, page, limit },
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Topups retrieved successfully',
      data: topups,
      meta: { total, page, limit },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = listTopupsController;

