const Page = require('../../models/Page');

async function getPageBySlugService(slug) {
  const page = await Page.findOne({ slug });
  return page;
}

module.exports = getPageBySlugService;
