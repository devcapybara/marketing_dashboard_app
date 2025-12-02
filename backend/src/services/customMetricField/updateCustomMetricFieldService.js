const CustomMetricField = require('../../models/CustomMetricField');

async function updateCustomMetricFieldService(fieldId, fieldData) {
  try {
    const {
      fieldLabel,
      fieldType,
      isRequired,
      defaultValue,
      displayOrder,
      isActive,
    } = fieldData;

    const field = await CustomMetricField.findById(fieldId);

    if (!field) {
      throw new Error('Custom metric field not found');
    }

    if (fieldLabel) field.fieldLabel = fieldLabel;
    if (fieldType) field.fieldType = fieldType;
    if (isRequired !== undefined) field.isRequired = isRequired;
    if (defaultValue !== undefined) field.defaultValue = defaultValue;
    if (displayOrder !== undefined) field.displayOrder = displayOrder;
    if (isActive !== undefined) field.isActive = isActive;

    await field.save();

    return field;
  } catch (error) {
    throw error;
  }
}

module.exports = updateCustomMetricFieldService;

