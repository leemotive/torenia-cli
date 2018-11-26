const path = require('path');
const Walker = require('walker');
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


  const walker = Walker(templateRoot);
  walker.filterDir(dir => !dir.includes('node_modules'))
  walker.on('file', file => {

    let targetFile = file.replace(templateRoot, projectRoot);
    const sourceFile = file;

    if (sourceFile.endsWith('.ejs')) {
      targetFile = targetFile.replace('.ejs', '');
      ejs.renderFile(sourceFile, data, {}, write);
    } else {
      fse.copy(sourceFile, targetFile);
    }


    function write (err, content) {
      if (err) {
        console.log(err);
        hasRejected = true;
        return;
      }
      fs.writeFile(targetFile, content, 'utf8', err => {
        if (err) {
          console.log(err);
          hasRejected = true;
          return;
        }
      });
    }

  });

  walker.on('dir', dir => {
    const newDir = dir.replace(templateRoot, projectRoot);
    try {
      fse.ensureDirSync(newDir);
    } catch(e) {
      hasRejected = true;
    }
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

