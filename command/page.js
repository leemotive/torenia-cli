const path = require('path');
const fse = require('fs-extra');

const cwd = process.cwd();
const pageTemplateRoot = path.resolve(__dirname, '../template/page');

module.exports = (data) => {
  const { name, key, pKey, menu, route, entry, icon, code } = data;
}
