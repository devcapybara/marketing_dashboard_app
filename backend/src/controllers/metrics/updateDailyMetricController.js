const updateDailyMetricService = require('../../services/metrics/updateDailyMetricService');

async function updateDailyMetricController(req, res, next) {
  try {
    const { id } = req.params;
    const {
      platform,
      date,
      spend,
      revenue,
      impressions,
      clicks,
      leads,
      notes,
      customFields,
    } = req.body;

    const metricData = {
      platform,
      date,
      spend,
      revenue,
      impressions,
      clicks,
      leads,
      notes,
      customFields,
    };

    const updatedMetric = await updateDailyMetricService(id, metricData);

    return res.status(200).json({
      success: true,
      message: 'Daily metric updated successfully',
      data: updatedMetric,
    });
  } catch (error) {
    if (error.message === 'Daily metric not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    if (error.message.includes('already exists')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

module.exports = updateDailyMetricController;

