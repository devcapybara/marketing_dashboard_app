const CalculatorSave = require('../../models/CalculatorSave');
const responseFormatter = require('../../utils/responseFormatter');

module.exports = async (req, res, next) => {
  try {
    const items = await CalculatorSave.find({ userId: req.user?._id }).sort({ createdAt: -1 });
    res.json(responseFormatter.success(items));
  } catch (err) {
    next(err);
  }
};
