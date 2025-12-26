const Page = require('../../models/Page');

async function updatePageService(id, payload) {
  const page = await Page.findByIdAndUpdate(id, payload, { new: true });
  return page;
}

module.exports = updatePageService;
