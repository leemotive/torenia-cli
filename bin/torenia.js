#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const yargs = require('yargs');
const inquirer = require('inquirer');
const colors = require('colors');

const create = require('../command/create');
const compile = require('../command/compile');

yargs.command('create <name>', 'initialize project', yargs => {
  return yargs.option('force', {
    alias: 'f',
    default: false,
    describe: 'rewrite if the target directory exists',
    type: 'boolean'
  })
}, argv => {
  const { name, force } = argv;

  const projectRoot = path.resolve(process.cwd(), name);
  if (fs.existsSync(projectRoot) && !force) {
    console.error(colors.red(`${projectRoot} has exist`));
    process.exit(1);
  }

  inquirer.prompt([
    {
      type: 'list',
      name: 'history',
      message: 'which history do you want to use?',
      choices: [
        { name: 'hashHistory', value: 'createHashHistory' },
        { name: 'browserHistory', value: 'createBrowserHistory' },
      ]
    }
  ]).then(answers => {
    create({ ...answers, name, force });
  })

});

yargs.command('compile', 'generate model, menu route', yargs => yargs, argv => {
  compile();
})

yargs.argv;
