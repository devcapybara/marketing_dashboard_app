const DailyMetric = require('../../models/DailyMetric');

async function updateDailyMetricService(metricId, metricData) {
  try {
    const {
      platform,
      date,
      spend,
      revenue,
      impressions,
      clicks,
      leads,
      notes,
    } = metricData;

    const metric = await DailyMetric.findById(metricId);

    if (!metric) {
      throw new Error('Daily metric not found');
    }

    if (platform) metric.platform = platform;
    if (date) metric.date = date;
    if (spend !== undefined) metric.spend = spend;
    if (revenue !== undefined) metric.revenue = revenue;
    if (impressions !== undefined) metric.impressions = impressions;
    if (clicks !== undefined) metric.clicks = clicks;
    if (leads !== undefined) metric.leads = leads;
    if (notes !== undefined) metric.notes = notes;

    await metric.save();

    return metric;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Daily metric already exists for this client, account, and date');
    }
    throw error;
  }
}

module.exports = updateDailyMetricService;

