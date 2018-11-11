const path = require('path');
const walk = require('walk');
const fs = require('fs');
const fse = require('fs-extra');
const ejs = require('ejs');
const colors = require('colors');

const cwd = process.cwd();
const templateRoot = path.resolve(__dirname, '../template/workspace');

module.exports = function (data) {

  const { name } = data;

  const projectRoot = path.resolve(cwd, name);

  fse.ensureDirSync(projectRoot);

  let hasRejected = false;
  let walkend = false;

  const spinner = '⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏';
  let count = 0;
  function spin() {
    process.stdout.write(`\r processing ${spinner[count++ % 10]} `);
    if (!hasRejected && (count < 30 || !walkend)) {
      setTimeout(spin, 100);
    }
  }
  spin();


  const walker = walk.walk(templateRoot);
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
      fse.ensureDirSync(path.resolve(newRoot, filename));
    } catch(e) {
      hasRejected = true;
    }
    hasRejected || next();
  });

  walker.on('end', () => {
    walkend = true;
  });

  process.on('exit', function() {
    if (hasRejected) {
      fse.removeSync(projectRoot);
      console.error(colors.red('\rcreate project failed'));
    } else {
      console.log('\rCreate project successfully');
    }
  });
}

