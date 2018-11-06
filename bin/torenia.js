#!/usr/bin/env node

const yargs = require('yargs');
const inquirer = require('inquirer');

const create = require('../command/create');
const compile = require('../command/compile');

yargs.command('create <name>', 'initialize project', yargs => yargs, argv => {
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
    create({ ...answers, name: argv.name });
  })

});

yargs.command('compile', 'generate model, menu route', yargs => yargs, argv => {
  compile();
})

yargs.argv;
