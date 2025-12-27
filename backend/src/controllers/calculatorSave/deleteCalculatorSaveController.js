const CalculatorSave = require('../../models/CalculatorSave');
const responseFormatter = require('../../utils/responseFormatter');

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await CalculatorSave.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json(responseFormatter.error('Not found'));
    res.json(responseFormatter.success({ id }));
  } catch (err) {
    next(err);
  }
};
