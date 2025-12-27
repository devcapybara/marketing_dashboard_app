const DailyMetric = require('../../models/DailyMetric');

async function createDailyMetricService(metricData) {
  try {
    const {
      clientId,
      adAccountId,
      platform,
      date,
      spend,
      revenue,
      impressions,
      clicks,
      leads,
      notes,
      customFields,
      createdBy,
    } = metricData;

    const metric = new DailyMetric({
      clientId,
      adAccountId,
      platform,
      date,
      spend,
      revenue: revenue || 0,
      impressions: impressions || 0,
      clicks: clicks || 0,
      leads: leads || 0,
      customFields: customFields || {},
      notes,
      createdBy,
    });

    await metric.save();

    return metric;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Daily metric already exists for this client, account, and date');
    }
    throw error;
  }
}

module.exports = createDailyMetricService;

