const CustomMetricField = require('../../models/CustomMetricField');

async function listCustomMetricFieldsService(filters = {}) {
  try {
    const { clientId, platform } = filters;

    const query = { isActive: true };

    if (clientId) {
      query.clientId = clientId;
    }

    if (platform) {
      query.$or = [
        { platform: platform },
        { platform: 'ALL' },
      ];
    }

    const fields = await CustomMetricField.find(query)
      .populate('createdBy', 'name email')
      .sort({ displayOrder: 1, createdAt: 1 });

    return fields;
  } catch (error) {
    throw new Error('Failed to list custom metric fields');
  }
}

module.exports = listCustomMetricFieldsService;

