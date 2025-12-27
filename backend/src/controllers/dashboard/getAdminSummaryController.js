const getAdminSummaryService = require('../../services/dashboard/getAdminSummaryService');

async function getAdminSummaryController(req, res, next) {
  try {
    const user = req.user;
    const { dateFrom, dateTo, clientId } = req.query;

    if (!user.managedClientIds || user.managedClientIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Admin summary retrieved successfully',
        data: {
          totalAdAccounts: 0,
          totalSpend: 0,
          totalRevenue: 0,
          totalTopup: 0,
          roas: 0,
          totalImpressions: 0,
          totalClicks: 0,
          totalLeads: 0,
          platformMetrics: [],
        },
      });
    }

    const filters = { dateFrom, dateTo };
    if (clientId) {
      const hasAccess = user.managedClientIds.some((id) => id.toString() === clientId.toString());
      if (!hasAccess) {
        return res.status(403).json({ success: false, message: 'Access denied for selected client' });
      }
      filters.clientId = clientId;
    }

    const summary = await getAdminSummaryService(user.managedClientIds, filters);

    return res.status(200).json({
      success: true,
      message: 'Admin summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = getAdminSummaryController;

