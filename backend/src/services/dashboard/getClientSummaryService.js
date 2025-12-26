const DailyMetric = require('../../models/DailyMetric');
const Topup = require('../../models/Topup');
const AdAccount = require('../../models/AdAccount');
const Lead = require('../../models/Lead');

async function getClientSummaryService(clientId, filters = {}) {
  try {
    const { dateFrom, dateTo } = filters;

    // Build date filter
    const dateFilter = { clientId };
    if (dateFrom || dateTo) {
      dateFilter.date = {};
      if (dateFrom) {
        dateFilter.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        dateFilter.date.$lte = new Date(dateTo);
      }
    }

    // Get total ad accounts
    const totalAdAccounts = await AdAccount.countDocuments({ clientId, isActive: true });

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

    // Leads and Funnel from Leads collection
    const startDate = dateFrom ? (()=>{ const d = new Date(dateFrom); d.setHours(0,0,0,0); return d; })() : null;
    const endDate = dateTo ? (()=>{ const d = new Date(dateTo); d.setHours(23,59,59,999); return d; })() : null;
    const leadMatch = { clientId };
    const exprConds = [];
    if (startDate) exprConds.push({ $gte: [{ $ifNull: [ '$createdAt', { $toDate: '$_id' } ] }, startDate ] });
    if (endDate) exprConds.push({ $lte: [{ $ifNull: [ '$createdAt', { $toDate: '$_id' } ] }, endDate ] });
    if (exprConds.length > 0) leadMatch.$expr = { $and: exprConds };
    const totalLeadsAgg = await Lead.aggregate([
      { $match: leadMatch },
      { $count: 'count' },
    ]);
    const totalLeadsCount = totalLeadsAgg[0]?.count || 0;
    const leadAgg = await Lead.aggregate([
      { $match: leadMatch },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const leadMap = new Map(leadAgg.map(l => [l._id || '', l.count]));
    const funnelData = {
      totalLeads: totalLeadsCount,
      noReply: leadMap.get('Tidak ada balasan') || 0,
      justAsking: leadMap.get('Masih tanya-tanya') || 0,
      potential: leadMap.get('Potensial') || 0,
      closing: leadMap.get('Closing') || 0,
      retention: leadMap.get('Retensi') || 0,
    };
    const cac = totalLeadsCount > 0 ? metrics.totalSpend / totalLeadsCount : 0;

    // VAT per-ad account
    const spendByAccount = await DailyMetric.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$adAccountId', spend: { $sum: '$spend' } } },
    ]);
    const accountIds = spendByAccount.map((s) => s._id).filter(Boolean);
    const accounts = await AdAccount.find({ _id: { $in: accountIds } }, { vatPercent: 1 }).lean();
    const vatMap = new Map(accounts.map((a) => [a._id.toString(), typeof a.vatPercent === 'number' ? a.vatPercent : 11]));
    const totalVat = spendByAccount.reduce((sum, s) => sum + s.spend * ((vatMap.get(s._id?.toString()) ?? 11) / 100), 0);
    const totalSpendWithVat = metrics.totalSpend + totalVat;
    const effectiveBalance = totalTopup - totalSpendWithVat;
    const cpl = (totalLeadsCount > 0) ? (totalSpendWithVat / totalLeadsCount) : 0;

    return {
      totalAdAccounts,
      totalSpend: metrics.totalSpend,
      totalRevenue: metrics.totalRevenue,
      totalTopup,
      totalVat: parseFloat(totalVat.toFixed(2)),
      totalSpendWithVat: parseFloat(totalSpendWithVat.toFixed(2)),
      effectiveBalance: parseFloat(effectiveBalance.toFixed(2)),
      roas: parseFloat(roas.toFixed(2)),
      cac: parseFloat(cac.toFixed(2)),
      cpl: parseFloat(cpl.toFixed(2)),
      totalImpressions: metrics.totalImpressions,
      totalClicks: metrics.totalClicks,
      totalLeads: totalLeadsCount,
      platformMetrics,
      chartData: {
        impressionSource: impressionData,
        funnel: funnelData,
      },
    };
  } catch (error) {
    throw new Error('Failed to get client summary');
  }
}

module.exports = getClientSummaryService;

