const getSuperAdminSummaryService = require('../../services/dashboard/getSuperAdminSummaryService');

async function getSuperAdminSummaryController(req, res, next) {
  try {
    const { dateFrom, dateTo, clientId, adminId } = req.query;

    const filters = { dateFrom, dateTo, clientId, adminId };

    const summary = await getSuperAdminSummaryService(filters);

    return res.status(200).json({
      success: true,
      message: 'Super admin summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = getSuperAdminSummaryController;

