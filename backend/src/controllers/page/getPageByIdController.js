const getPageByIdService = require('../../services/page/getPageByIdService');

async function getPageByIdController(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;
    const page = await getPageByIdService(id);
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    if (user?.role !== 'SUPER_ADMIN' && String(page.createdBy) !== String(user._id)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
}

module.exports = getPageByIdController;
