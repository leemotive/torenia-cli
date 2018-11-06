
const walk = require('walk');
const fs = require('fs');
const JSON5 = require('json5');
const path = require('path');

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
            if (entry && 'idnex.js' !== entry) {
              entry = `/${path.basename(entry, '.js')}`;
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
      models.push(`app.model(require('${fullname}').default);`)
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
            component: `require('${filePath}/${entry || 'index.js'}').default`,
          }
        })
      }
    ];

    const routesString = JSON5.stringify(routes, {
      quote: ' ',
      space: 2,
    }).replace(/(: ) /g, '$1').replace(/ ,/g, ',');
    const routesFile = `${srcDir}/router.js`;
    let content = fs.readFileSync(routesFile, 'utf8');
    content = content.replace(/(\/\/ routes start\n)(.|\n)*(\/\/ routes end)/, `$1const routes = ${routesString};\n$3`);
    fs.writeFileSync(routesFile, content, {
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
    const configFile = `${srcDir}/utils/config.js`;
    content = fs.readFileSync(configFile, 'utf8');
    content = content.replace(/(\/\/ menus start\n)(.|\n)*(\/\/ menus end)/, `$1const menu = ${menuString};\n$3`)
    fs.writeFileSync(configFile, content, {
      encoding: 'utf8'
    });


    // model生成
    const modelsString = models.join('\n');
    const containerFile = `${srcDir}/container.js`;
    content = fs.readFileSync(containerFile, 'utf8');
    content = content.replace(/(\/\/ models start\n)(.|\n)*(\/\/ models end)/, `$1${modelsString}\n$3`);
    fs.writeFileSync(containerFile, content, {
      encoding: 'utf8'
    });

  });

}
