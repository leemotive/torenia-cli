
const walk = require('walk');
const fs = require('fs');
const JSON5 = require('json5');
const path = require('path');
const fse = require('fs-extra');

const cwd = process.cwd();
const srcDir = `${cwd}/src`;
const pageDir = `${srcDir}/pages`;


module.exports = () => {

  const walker = walk.walk(srcDir);

  const configs = [];
  const models = [];
  walker.on('file', (root, fileStats, next) => {
    const { name } = fileStats;
    const fullname = path.resolve(root, name);
    if ('package.json' === name) {
      const pkg = require(fullname);
      let { torenia: configArr } = pkg;
      if (configArr && !Array.isArray(configArr)) {
        configArr = [ configArr ];
      }
      configArr.forEach(c => {
        if (c) {
          c.filePath = root;
          if (c.route === undefined) {
            let entry = c.entry || '';
            if (entry) {
              let basename = path.basename(entry, '.js');
              if (basename !== 'index') {
                entry = `/${basename}`;
              } else {
                entry = ''
              }
            }
            c.route = `${c.filePath}${entry}`.replace(pageDir, '').replace(/\$id/g, ':id') || '/';
          }
          if (c.menu === undefined) {
            c.menu = c.route || `/${pkg.name}`;
          }
          c.pkgName = pkg.name;
          configs.push(c);
        }
      })
    } else if ('model.js' === name || root.endsWith('/models') && path.extname(name) === '.js') {
      models.push(`  require('${fullname}').default,`)
    }

    next();
  });

  walker.on('end', () => {

    // 生成路由
    const routes = [
      {
        path: `'/'`,
        component: `require('${srcDir}/layouts/index.js').default`,
        routes: configs.filter(r => r && r.route).map(config => {
          const { filePath, route, entry } = config;
          return {
            path: `'${route}'`,
            exact: true,
            component: `require('${path.resolve(filePath, entry || 'index.js')}').default`,
          }
        })
      }
    ];

    const routesString = JSON5.stringify(routes, {
      quote: ' ',
      space: 2,
    }).replace(/(: ) /g, '$1').replace(/ ,/g, ',');
    const routesFile = `${srcDir}/.torenia/router.js`;
    fse.outputFileSync(routesFile, `export default ${routesString};\n`, {
      encoding: 'utf8'
    });


    // 菜单生成
    const menuConfigs = configs.filter(c => c && c.menu);
    const menus = menuConfigs.map(m => {
      const route = m.menu || m.route;
      const key = (m.key == undefined ? route : m.key).replace(/^\//, '');
      return {
        key,
        pKey: m.pKey || '',
        route,
        title: m.title || m.pkgName,
        icon: m.icon || 'appstore',
        code: m.code,
      };
    });
    const menuString = JSON5.stringify(menus, {
      quote: '\'',
      space: 2,
    });
    const configFile = `${srcDir}/.torenia/menu.js`;
    fse.outputFileSync(configFile, `export default ${menuString};\n`, {
      encoding: 'utf8'
    });


    // model生成
    const modelsString = models.join('\n');
    const containerFile = `${srcDir}/.torenia/models.js`;
    fs.writeFileSync(containerFile, `export default [\n${modelsString}\n];\n`, {
      encoding: 'utf8'
    });

  });

}
