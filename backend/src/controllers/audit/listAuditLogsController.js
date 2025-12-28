const listAuditLogsService = require('../../services/audit/listAuditLogsService');

async function listAuditLogsController(req, res, next) {
  try {
    const { page = 1, limit = 20, userId, action, startDate, endDate, email } = req.query;
    const params = {
      page: Number(page),
      limit: Number(limit),
      filters: {
        userId,
        action,
        startDate,
        endDate,
        email,
      },
    };
    const result = await listAuditLogsService(params);
    return res.status(200).json({
      success: true,
      message: 'Audit logs retrieved successfully',
      data: result.items,
      pagination: {
        page: result.page,
        limit: result.limit,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = listAuditLogsController;
