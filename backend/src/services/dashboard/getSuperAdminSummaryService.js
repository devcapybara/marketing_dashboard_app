const Client = require('../../models/Client');
const DailyMetric = require('../../models/DailyMetric');
const Topup = require('../../models/Topup');
const AdAccount = require('../../models/AdAccount');

async function getSuperAdminSummaryService(filters = {}) {
  try {
    const { dateFrom, dateTo } = filters;

    // Get total clients
    const totalClients = await Client.countDocuments({ status: 'ACTIVE' });

    // Get total ad accounts
    const totalAdAccounts = await AdAccount.countDocuments({ isActive: true });

    // Build date filter for metrics and topups
    const dateFilter = {};
    if (dateFrom || dateTo) {
      dateFilter.date = {};
      if (dateFrom) {
        dateFilter.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        dateFilter.date.$lte = new Date(dateTo);
      }
    }

    // Get total spend and revenue from metrics
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

    // Calculate ROAS (Return on Ad Spend)
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

    // Calculate CAC (Customer Acquisition Cost)
    const cac = metrics.totalLeads > 0 ? metrics.totalSpend / metrics.totalLeads : 0;

    // Funnel data (placeholder - bisa diambil dari custom fields atau leads breakdown)
    // Untuk sekarang kita gunakan leads sebagai base
    const funnelData = {
      totalLeads: metrics.totalLeads || 0,
      noReply: 0, // TODO: bisa dari custom fields atau model terpisah
      justAsking: 0,
      potential: 0,
      closing: 0,
      retention: 0,
    };

    return {
      totalClients,
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
    throw new Error('Failed to get super admin summary');
  }
}

module.exports = getSuperAdminSummaryService;

