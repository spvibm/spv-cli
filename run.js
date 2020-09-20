#!/usr/bin/env node

const fs = require('fs-extra');

// node example.js create --name cards // node example.js create --name=cards-ms // node example.js create cards-ms

require('yargs')
  .scriptName("project-creation")
  .usage('$0 <cmd> [args]')
  .command('create <name>', 'Creates a project', (yargs) => {
    // .command('create [name]', 'Creates a project', (yargs) => {
      yargs.positional('name', {
        type: 'string',
        default: 'spv-example',
        describe: 'Project name'
        })
  }, function (argv) {

    // TO DO: CLONE REPO IN CURRENT DIRECTORY 
    // TO DO: COLOCAR COMO DEPENDENCIA A SPV-BASE 
    const template_path = require("spv-base");
    let projectName = argv.name;
    // // set projectName
    // // set destinationDirectory

    console.log(template_path.dirname)
    fs.copySync(template_path.dirname, "./"+projectName);
    // console.log('your project', argv.name, 'was created!')


  })
  .help()
  .argv


// node run.js add accesspoint -n modulename -v GET POST PUT DELETE -r routename cards
// node run.js add accesspoint --name modulename --verbs GET POST PUT DELETE --route routename cards
  require('yargs')
  .usage('Usage: $0 <cmd> [options]') // usage string of application.
  .command('add accesspoint', 'adds accesspoint ...' , (yargs) => { 

    yargs.option('n', {
      alias: 'name',
      description: 'the name of the rest module'
    })
    .demand('n') 
  
    yargs.option('v', { 
      array: true, // even single values will be wrapped in [].
      description: 'an array of strings',
      // default: 'test.js',
      alias: 'verbs'
    })
    .demand('v')
    .alias('v', 'verbs')
  
    yargs.option('r', {
      alias: 'route',
      description: 'endpoint route'
    })
    .demand('r') // fail if 'q' not provided.
    .alias('route', 'r')


  }, function (argv) {

    console.log()
    console.log()
    console.log(argv.name)
    console.log()
    console.log(argv.verbs)
    console.log()
    console.log(argv.route)
    console.log()
    console.log()


  })
  .help()
  .argv
