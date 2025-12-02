const DailyMetric = require('../../models/DailyMetric');

async function getDailyMetricByIdService(metricId) {
  try {
    const metric = await DailyMetric.findById(metricId)
      .populate('clientId', 'name companyName')
      .populate('adAccountId', 'accountName accountId platform')
      .populate('createdBy', 'name email');
    return metric;
  } catch (error) {
    throw new Error('Failed to get daily metric by ID');
  }
}

module.exports = getDailyMetricByIdService;

