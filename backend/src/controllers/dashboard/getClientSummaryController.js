const getClientSummaryService = require('../../services/dashboard/getClientSummaryService');

async function getClientSummaryController(req, res, next) {
  try {
    const user = req.user;
    const { dateFrom, dateTo } = req.query;

    if (!user.clientId) {
      return res.status(400).json({
        success: false,
        message: 'Client ID not assigned to this user',
      });
    }

    const filters = { dateFrom, dateTo };

    const summary = await getClientSummaryService(user.clientId, filters);

    return res.status(200).json({
      success: true,
      message: 'Client summary retrieved successfully',
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = getClientSummaryController;

