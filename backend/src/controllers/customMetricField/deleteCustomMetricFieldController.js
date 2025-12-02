const deleteCustomMetricFieldService = require('../../services/customMetricField/deleteCustomMetricFieldService');

async function deleteCustomMetricFieldController(req, res, next) {
  try {
    const { id } = req.params;

    await deleteCustomMetricFieldService(id);

    return res.status(200).json({
      success: true,
      message: 'Custom metric field deleted successfully',
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

module.exports = deleteCustomMetricFieldController;

