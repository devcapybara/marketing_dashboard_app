const CalculatorSave = require('../../models/CalculatorSave');
const responseFormatter = require('../../utils/responseFormatter');

module.exports = async (req, res, next) => {
  try {
    const payload = { ...req.body, userId: req.user?._id };
    const saved = await CalculatorSave.create(payload);
    res.json(responseFormatter.success(saved));
  } catch (err) {
    next(err);
  }
};
