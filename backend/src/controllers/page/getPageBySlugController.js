const getPageBySlugService = require('../../services/page/getPageBySlugService');

async function getPageBySlugController(req, res, next) {
  try {
    const { slug } = req.params;
    const page = await getPageBySlugService(slug);
    if (!page || !page.isPublished) {
      return res.status(404).json({ success: false, message: 'Page not found' });
    }
    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    next(error);
  }
}

module.exports = getPageBySlugController;
