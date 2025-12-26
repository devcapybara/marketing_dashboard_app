const Page = require('../../models/Page');

async function deletePageService(id) {
  await Page.findByIdAndDelete(id);
  return true;
}

module.exports = deletePageService;
