const CustomMetricField = require('../../models/CustomMetricField');

async function createCustomMetricFieldService(fieldData) {
  try {
    const {
      clientId,
      platform,
      fieldName,
      fieldLabel,
      fieldType,
      isRequired,
      defaultValue,
      displayOrder,
      createdBy,
    } = fieldData;

    // Check if field with same name already exists for this client and platform
    const existingField = await CustomMetricField.findOne({
      clientId,
      platform: { $in: [platform, 'ALL'] },
      fieldName,
      isActive: true,
    });

    if (existingField) {
      throw new Error(`Field "${fieldName}" already exists for this client and platform`);
    }

    const customField = new CustomMetricField({
      clientId,
      platform: platform || 'ALL',
      fieldName,
      fieldLabel,
      fieldType: fieldType || 'NUMBER',
      isRequired: isRequired || false,
      defaultValue,
      displayOrder: displayOrder || 0,
      createdBy,
    });

    await customField.save();

    return customField;
  } catch (error) {
    throw error;
  }
}

module.exports = createCustomMetricFieldService;

