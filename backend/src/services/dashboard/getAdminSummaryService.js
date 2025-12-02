const DailyMetric = require('../../models/DailyMetric');
const Topup = require('../../models/Topup');
const AdAccount = require('../../models/AdAccount');

async function getAdminSummaryService(managedClientIds, filters = {}) {
  try {
    const { dateFrom, dateTo } = filters;

    if (!managedClientIds || managedClientIds.length === 0) {
      return {
        totalAdAccounts: 0,
        totalSpend: 0,
        totalRevenue: 0,
        totalTopup: 0,
        roas: 0,
        totalImpressions: 0,
        totalClicks: 0,
        totalLeads: 0,
        platformMetrics: [],
      };
    }

    // Build date filter
    const dateFilter = { clientId: { $in: managedClientIds } };
    if (dateFrom || dateTo) {
      dateFilter.date = {};
      if (dateFrom) {
        dateFilter.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        dateFilter.date.$lte = new Date(dateTo);
      }
    }

    // Get total ad accounts for managed clients
    const totalAdAccounts = await AdAccount.countDocuments({
      clientId: { $in: managedClientIds },
      isActive: true,
    });

    // Get metrics aggregation
    const metricsAggregation = await DailyMetric.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalSpend: { $sum: '$spend' },
          totalRevenue: { $sum: '$revenue' },
          totalImpressions: { $sum: '$impressions' },
          totalClicks: { $sum: '$clicks' },
          totalLeads: { $sum: '$leads' },
        },
      },
    ]);

    const metrics = metricsAggregation[0] || {
      totalSpend: 0,
      totalRevenue: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalLeads: 0,
    };

    // Get total topups
    const topupsAggregation = await Topup.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalTopup: { $sum: '$amount' },
        },
      },
    ]);

    const totalTopup = topupsAggregation[0]?.totalTopup || 0;

    // Calculate ROAS
    const roas = metrics.totalSpend > 0 ? metrics.totalRevenue / metrics.totalSpend : 0;

    // Get metrics by platform
    const platformMetrics = await DailyMetric.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$platform',
          spend: { $sum: '$spend' },
          revenue: { $sum: '$revenue' },
          impressions: { $sum: '$impressions' },
          clicks: { $sum: '$clicks' },
          leads: { $sum: '$leads' },
        },
      },
    ]);

    // Get impression data per platform for chart
    const impressionData = {
      googleAds: 0,
      metaAds: 0,
      tiktokAds: 0,
    };

    platformMetrics.forEach((platform) => {
      if (platform._id === 'GOOGLE') {
        impressionData.googleAds = platform.impressions || 0;
      } else if (platform._id === 'META') {
        impressionData.metaAds = platform.impressions || 0;
      } else if (platform._id === 'TIKTOK') {
        impressionData.tiktokAds = platform.impressions || 0;
      }
    });

    // Calculate CAC
    const cac = metrics.totalLeads > 0 ? metrics.totalSpend / metrics.totalLeads : 0;

    // Funnel data
    const funnelData = {
      totalLeads: metrics.totalLeads || 0,
      noReply: 0,
      justAsking: 0,
      potential: 0,
      closing: 0,
      retention: 0,
    };

    return {
      totalAdAccounts,
      totalSpend: metrics.totalSpend,
      totalRevenue: metrics.totalRevenue,
      totalTopup,
      roas: parseFloat(roas.toFixed(2)),
      cac: parseFloat(cac.toFixed(2)),
      totalImpressions: metrics.totalImpressions,
      totalClicks: metrics.totalClicks,
      totalLeads: metrics.totalLeads,
      platformMetrics,
      chartData: {
        impressionSource: impressionData,
        funnel: funnelData,
      },
    };
  } catch (error) {
    throw new Error('Failed to get admin summary');
  }
}

module.exports = getAdminSummaryService;

