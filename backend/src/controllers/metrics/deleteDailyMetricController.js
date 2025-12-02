const deleteDailyMetricService = require('../../services/metrics/deleteDailyMetricService');

async function deleteDailyMetricController(req, res, next) {
  try {
    const { id } = req.params;

    await deleteDailyMetricService(id);

    return res.status(200).json({
      success: true,
      message: 'Daily metric deleted successfully',
    });
  } catch (error) {
    if (error.message === 'Daily metric not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

module.exports = deleteDailyMetricController;

