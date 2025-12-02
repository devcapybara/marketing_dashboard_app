const CustomMetricField = require('../../models/CustomMetricField');

async function deleteCustomMetricFieldService(fieldId) {
  try {
    const field = await CustomMetricField.findById(fieldId);

    if (!field) {
      throw new Error('Custom metric field not found');
    }

    // Soft delete - set isActive to false instead of hard delete
    // This preserves data integrity for existing metrics
    field.isActive = false;
    await field.save();

    return { message: 'Custom metric field deleted successfully' };
  } catch (error) {
    throw error;
  }
}

module.exports = deleteCustomMetricFieldService;

