const DailyMetric = require('../../models/DailyMetric');

async function deleteDailyMetricService(metricId) {
  try {
    const metric = await DailyMetric.findById(metricId);

    if (!metric) {
      throw new Error('Daily metric not found');
    }

    await DailyMetric.findByIdAndDelete(metricId);

    return { message: 'Daily metric deleted successfully' };
  } catch (error) {
    throw error;
  }
}

module.exports = deleteDailyMetricService;

