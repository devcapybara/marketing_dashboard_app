const getDailyMetricByIdService = require('../../services/metrics/getDailyMetricByIdService');

async function getDailyMetricDetailController(req, res, next) {
  try {
    const { id } = req.params;

    const metric = await getDailyMetricByIdService(id);

    if (!metric) {
      return res.status(404).json({
        success: false,
        message: 'Daily metric not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Daily metric retrieved successfully',
      data: metric,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = getDailyMetricDetailController;

