const Page = require('../../models/Page');

async function listPagesService() {
  const pages = await Page.find().sort({ updatedAt: -1 });
  return pages;
}

module.exports = listPagesService;
