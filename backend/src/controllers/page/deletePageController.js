const deletePageService = require('../../services/page/deletePageService');

const getPageByIdService = require('../../services/page/getPageByIdService');

async function deletePageController(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;
    const existing = await getPageByIdService(id);
    if (!existing) return res.status(404).json({ success: false, message: 'Page not found' });
    if (user?.role !== 'SUPER_ADMIN' && String(existing.createdBy) !== String(user._id)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    await deletePageService(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = deletePageController;
