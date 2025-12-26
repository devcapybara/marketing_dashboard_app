const Page = require('../../models/Page');

async function getPageByIdService(id) {
  const page = await Page.findById(id);
  return page;
}

module.exports = getPageByIdService;
