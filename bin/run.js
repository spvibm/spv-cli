#!/usr/bin/env node

const Messages = new (require('./messages'));
const Helper = new (require('./helper'));
const fse = require('fs-extra');
const fs = require('fs');

// Crea nuevo projecto
require('yargs')
  .scriptName("project-creation")
  .usage('$0 <cmd> [args]')
  .command('create <name>', 'Creates a project', (yargs) => {
      yargs.positional('name', {
        type: 'string',
        default: 'spv-example',
        describe: 'Project name'
        })
  }, function (argv) {

      const template_path = require("spv-base");
      let projectName = argv.name;
      fse.copySync(template_path.dirname, "./"+projectName);

      let spvInfo = fse.readJsonSync( process.cwd() + "/" + projectName + '/spv.json' );
      spvInfo["basePath"] = "/"+projectName+"/api/";
      fse.writeJsonSync( process.cwd() + "/" + projectName + '/spv.json' , spvInfo, {spaces: 2} )

      Messages.onProjectCreated(argv.name, projectName);

  })
  .help()
  .argv

// Crea nuevo módulo REST
require('yargs')
  .usage('Usage: $0 <cmd> [options]') 
  .command('add accesspoint', 'adds accesspoint ...' , (yargs) => { 

    yargs.option('n', {
      alias: 'name',
      description: 'the name of the rest module'
    })
    .demand('n') 
  
    yargs.option('v', { 
      array: true, 
      description: 'an array of strings',
      alias: 'verbs'
    })
    .demand('v')
    .alias('v', 'verbs')
  
    yargs.option('r', {
      alias: 'route',
      description: 'endpoint route'
    })
    .demand('r') 
    .alias('route', 'r')

  }, function (argv) {

    Helper.createRestModule({ 
      name: argv.name , 
      verbs: argv.verbs , 
      route: argv.route 
    })

  })
  .help()
  .argv

// Crea módulos REST a partir de una definición Swagger en formato JSON (no YAML)
require('yargs')
.scriptName("project-creation")
.usage('Usage: $0 <cmd> [options]')
.command('add+ accesspoints', 'adds accesspoints reading a swagger json file', (yargs) => {

  yargs.option('r', {
    alias: 'swaggerJson',
    description: 'reference to a swagger json file'
  })
  .demand('j') 
  .alias('swaggerJson', 'j')

}, function (argv) {

  let swaggerJsonRoute = argv.swaggerJson;

  if (!fse.pathExistsSync(swaggerJsonRoute)){
    return Messages.swaggerJsonPathDoesNotExist()
  }

  let swaggerJson = fse.readJsonSync(swaggerJsonRoute)

  Helper.createRestModulesFromSwaggerJson(swaggerJson);

})
.help()
.argv
