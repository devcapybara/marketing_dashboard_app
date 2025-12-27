const CalculatorSave = require('../../models/CalculatorSave');
const responseFormatter = require('../../utils/responseFormatter');

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await CalculatorSave.findById(id);
    if (!item) return res.status(404).json(responseFormatter.error('Not found'));
    res.json(responseFormatter.success(item));
  } catch (err) {
    next(err);
  }
};
