#!/usr/bin/env node

const fse = require('fs-extra');
const fs = require('fs');

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

      const template_path = require("spv-base");
      let projectName = argv.name;
      fse.copySync(template_path.dirname, "./"+projectName);
      console.log('your project', argv.name, 'was created!')

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

      const template_path = require("spv-extension-rest").paths;
      let accessPointName = argv.name;
      let accessPointVerbsArray = argv.verbs;
      let accessPointNameRoute = argv.route;
      let destinationDirectory;

      // validate we are in the root of a spv project 
      if ( !fs.existsSync(process.cwd()+'/spv.json') ) {
        return console.log("current directory is not a supervielle project")
      };

      // validate we find modules folder
      if ( !fs.existsSync(process.cwd()+'/src/modules') ) {
        return console.log("the installer found no 'src/modules' folder")
      }
      // set destinationDirectory
      destinationDirectory = process.cwd()+'/src/modules/'+accessPointName

      fse.copySync(template_path.templates, destinationDirectory);

        const path = require('path');
        const util = require('util');
        
        const traverse = function(dir, result = []) {
        
            // list files in directory and loop through
            fs.readdirSync(dir).forEach((file) => {
        
                // builds full path of file
                const fPath = path.resolve(dir, file);
        
                // prepare stats obj
                const fileStats = { file, path: fPath };
        
                // is the file a directory ? 
                // if yes, traverse it also, if no just add it to the result
                if (fs.statSync(fPath).isDirectory()) {
                    fileStats.type = 'dir';
                    fileStats.files = [];
                    result.push(fileStats);
                    return traverse(fPath, fileStats.files)
                }
        
                fileStats.type = 'file';

                  let requiredFile = require(fPath)
                  let templateFile = requiredFile;

                  templateFile = requiredFile.replace(new RegExp("{className}", 'g'), accessPointName.charAt(0).toUpperCase() + accessPointName.slice(1) );
                  templateFile = templateFile.replace(new RegExp("{route}", 'g'), '/"'+accessPointNameRoute+'"');
                  templateFile = templateFile.replace(new RegExp("{verbs}", 'g'), JSON.stringify(accessPointVerbsArray) );

                  // fse.copySync(template_path.dirname, "./"+projectName);
                  fs.outputFileSync(fPath, templateFile)

                result.push(fileStats);
            });
            return result;
        };

        let spvInfo = fs.readJsonSync(process.cwd()+'/spv.json')
        spvInfo.accessPoints.push({ "name" : args[0] })
        fs.writeJsonSync( process.cwd()+'/spv.json', spvInfo, {spaces: 2} )

        // console.log(traverse(destinationDirectory))

  })
  .help()
  .argv
