const Page = require('../../models/Page');

async function listOwnPagesService(userId) {
  const pages = await Page.find({ createdBy: userId }).sort({ updatedAt: -1 });
  return pages;
}

module.exports = listOwnPagesService;
