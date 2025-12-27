const CalculatorSave = require('../../models/CalculatorSave');
const responseFormatter = require('../../utils/responseFormatter');

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await CalculatorSave.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json(responseFormatter.error('Not found'));
    res.json(responseFormatter.success(updated));
  } catch (err) {
    next(err);
  }
};
