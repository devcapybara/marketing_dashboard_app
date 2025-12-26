const updatePageService = require('../../services/page/updatePageService');

const getPageByIdService = require('../../services/page/getPageByIdService');

async function updatePageController(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;
    const existing = await getPageByIdService(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Page not found' });
    if (user?.role !== 'SUPER_ADMIN' && String(existing.createdBy) !== String(user._id)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    const page = await updatePageService(id, req.body);
    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
}

module.exports = updatePageController;
