const { summary } = require('../../utils/requestMetrics');
const responseFormatter = require('../../utils/responseFormatter');

module.exports = async (req, res, next) => {
  try {
    return res.json(responseFormatter.success(summary()));
  } catch (err) {
    next(err);
  }
};
