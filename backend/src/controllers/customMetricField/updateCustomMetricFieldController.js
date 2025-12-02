const updateCustomMetricFieldService = require('../../services/customMetricField/updateCustomMetricFieldService');

async function updateCustomMetricFieldController(req, res, next) {
  try {
    const { id } = req.params;
    const {
      fieldLabel,
      fieldType,
      isRequired,
      defaultValue,
      displayOrder,
      isActive,
    } = req.body;

    const fieldData = {
      fieldLabel,
      fieldType,
      isRequired,
      defaultValue,
      displayOrder,
      isActive,
    };

    const updatedField = await updateCustomMetricFieldService(id, fieldData);

    return res.status(200).json({
      success: true,
      message: 'Custom metric field updated successfully',
      data: updatedField,
    });
  } catch (error) {
    if (error.message === 'Custom metric field not found') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
}

module.exports = updateCustomMetricFieldController;

