const Page = require('../../models/Page');

async function createPageService(payload, userId) {
  const page = await Page.create({ ...payload, createdBy: userId });
  return page;
}

module.exports = createPageService;
