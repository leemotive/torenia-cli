const path = require('path');
const walk = require('walk');
const fs = require('fs');
const fse = require('fs-extra');
const ejs = require('ejs');

const cwd = process.cwd();
const templateRoot = path.resolve(__dirname, '../template');

module.exports = function (data) {

  const projectRoot = path.resolve(cwd, data.name);

  if (fs.existsSync(projectRoot)) {
    console.error(`${projectRoot} has exist`);
    return;
  }

  fs.mkdirSync(projectRoot);

  const walker = walk.walk(path.resolve(templateRoot));
  let hasRejected = false;


  walker.on('file', (root, fileStats, next) => {
    const filename = fileStats.name;
    const newRoot = root.replace(templateRoot, projectRoot);

    const sourceFile = path.resolve(root, filename);
    let targetFile = path.resolve(newRoot, filename);

    if (filename.endsWith('.ejs')) {
      targetFile = targetFile.replace('.ejs', '');
      ejs.renderFile(sourceFile, data, {}, write);
    } else {
      fs.readFile(sourceFile, 'utf8', write);
    }


    function write (err, content) {
      if (err) {
        hasRejected = true;
        return;
      }
      fs.writeFile(targetFile, content, 'utf8', err => {
        if (err) {
          hasRejected = true;
          return;
        }
      });
    }

    hasRejected || next();
  });

  walker.on('directory', (root, fileStats, next) => {
    const filename = fileStats.name;
    const newRoot = root.replace(templateRoot, projectRoot);
    try {
      fs.mkdirSync(path.resolve(newRoot, filename));
    } catch(e) {
      hasRejected = true;
    }
    hasRejected || next();
  })

  process.on('exit', function() {
    if (hasRejected) {
      fse.removeSync(projectRoot);
      console.error('create project failed');
    } else {
      console.log('Create project successfully');
    }
  });
}



