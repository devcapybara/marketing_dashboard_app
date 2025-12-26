const listPagesService = require('../../services/page/listPagesService');

async function listPagesController(req, res, next) {
  try {
    const user = req.user;
    let pages;
    if (user?.role === 'SUPER_ADMIN') {
      pages = await listPagesService();
    } else {
      const listOwnPagesService = require('../../services/page/listOwnPagesService');
      pages = await listOwnPagesService(user._id);
    }
    return res.status(200).json({ success: true, data: pages });
  } catch (error) {
    next(error);
  }
}

module.exports = listPagesController;
