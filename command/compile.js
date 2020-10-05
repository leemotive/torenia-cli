const Walker = require('walker');
const fs = require('fs');
const JSON5 = require('json5');
const path = require('path');
const fse = require('fs-extra');

const cwd = process.cwd();

let srcPath, pagePath;
const pkg = require(path.require(cwd, 'package.json'))
if (pkg.torenia) {
  srcPath = pkg.torenia.src;
  pagePath = pkg.torenia.pages;
} else if (fs.existsSync(path.resolve(cwd, '.torenia.config.js'))) {
  const cfg = require(path.resolve(cwd, '.torenia.config.js'));
  srcPath = cfg.src;
  pagePath = cfg.pages;
} else {
  srcPath = 'src';
  pagePath = 'pages'
}

const srcDir = path.resolve(cwd, srcPath);
const pageDir = path.resolve(srcDir, pagePath);

module.exports = () => {
  const walker = Walker(srcDir);

  const configs = [];
  const models = [];
  walker.on('file', file => {
    const name = path.basename(file);
    const fileDirPath = path.dirname(file);
    if ('package.json' === name) {
      const pkg = require(file);
      let { torenia: configArr } = pkg;
      if (configArr && !Array.isArray(configArr)) {
        configArr = [configArr];
      }
      configArr &&
        configArr.forEach(c => {
          if (c) {
            c.filePath = fileDirPath;
            if (c.route === undefined) {
              let entry = c.entry || '';
              if (entry) {
                let basename = path.basename(entry, '.js');
                if (basename !== 'index') {
                  entry = basename;
                } else {
                  entry = '';
                }
              }
              c.route =
                path
                  .resolve(fileDirPath, entry)
                  .replace(pageDir, '')
                  .split(path.sep)
                  .join('/')
                  .replace(/\$id/g, ':id') || '/';
            }
            if (c.menu === undefined) {
              c.menu = c.route || `/${pkg.name}`;
            }
            c.pkgName = pkg.name;
            configs.push(c);
          }
        });
    } else if (
      'model.js' === name ||
      (fileDirPath.endsWith(`${path.sep}models`) &&
        path.extname(name) === '.js')
    ) {
      models.push(
        `  require(${JSON5.stringify(file, { quote: "'" })}).default,`,
      );
    }
  });

  walker.on('end', () => {
    // 生成路由
    const routes = [
      {
        path: `'/'`,
        component: `require('${path.resolve(
          srcDir,
          'layouts/index.js',
        )}').default`,
        routes: configs
          .filter(r => r && r.route)
          .map(config => {
            const { filePath, route, entry } = config;
            return {
              path: `'${route}'`,
              exact: true,
              component: `require('${path.resolve(
                filePath,
                entry || 'index.js',
              )}').default`,
            };
          }),
      },
    ];

    const routesString = JSON5.stringify(routes, {
      quote: ' ',
      space: 2,
    })
      .replace(/(: ) /g, '$1')
      .replace(/ ,/g, ',');
    const routesFile = path.resolve(srcDir, '.torenia/router.js');
    fse.outputFileSync(routesFile, `export default ${routesString};\n`, {
      encoding: 'utf8',
    });

    // 菜单生成
    const menuConfigs = configs.filter(c => c);
    const menus = menuConfigs.map(m => {
      const route = m.menu || m.route;
      const key = (m.key == undefined ? route : m.key).replace(/^\//, '');
      return {
        key,
        pKey: m.pKey || '',
        menu: m.menu,
        route,
        title: m.title || m.pkgName,
        icon: m.icon || 'appstore',
        code: m.code,
      };
    });
    const menuString = JSON5.stringify(menus, {
      quote: "'",
      space: 2,
    });
    const configFile = path.resolve(srcDir, '.torenia/menu.js');
    fse.outputFileSync(configFile, `export default ${menuString};\n`, {
      encoding: 'utf8',
    });

    // model生成
    const modelsString = models.join('\n');
    const containerFile = path.resolve(srcDir, '.torenia/models.js');
    fs.writeFileSync(containerFile, `export default [\n${modelsString}\n];\n`, {
      encoding: 'utf8',
    });
  });
};
