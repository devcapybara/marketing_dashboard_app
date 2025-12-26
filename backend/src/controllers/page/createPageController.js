const createPageService = require('../../services/page/createPageService');

async function createPageController(req, res, next) {
  try {
    const user = req.user;
    const page = await createPageService(req.body, user._id);
    return res.status(201).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
}

module.exports = createPageController;
