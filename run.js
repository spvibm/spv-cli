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
      console.log()
      console.log('your project', argv.name, 'was created!')
      console.log()

        // VALIDATE TO ONLY WRITE ONCE
      let spvInfo = fse.readJsonSync(process.cwd()+projectName+'/spv.json')
      spvInfo["basePath"] = "/"+projectName+"/api/";
      fse.writeJsonSync( process.cwd()+projectName+'/spv.json', spvInfo, {spaces: 2} )


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


        const isRequirable = function (filename) {
          var result;
          var content;
          var rex = /(?:^|\s*;|\s*=)\s*(?:module\.)*exports(\..+)*\s*=\s*.+/gm;
      
          try {
              content = fs.readFileSync(filename).toString();
          } catch (err) {
              content = '';
              console.log(err);
          }
          result = content.match(rex) ? true : false;
          if (result) {
              try {
                  var temp = require(filename);
              } catch (err) {
                  result = false;
                  console.log(err);
              }
          }
          return result;
      };

      fse.copySync(template_path.templates, destinationDirectory);


        const traverse = function(dir, result = []) {

            // const util = require('util');
        
            // list files in directory and loop through
            fs.readdirSync(dir).forEach((file) => {

              
                const path = require('path');
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

                if (isRequirable(fPath)){

                  let requiredFile = require(fPath)
                  let templateFile = requiredFile;

                  templateFile = requiredFile.replace(new RegExp("{className}", 'g'), accessPointName.charAt(0).toUpperCase() + accessPointName.slice(1) );
                  let routeToAdd;
                  if (accessPointNameRoute.substring(accessPointNameRoute.length-1) != "/"){
                    routeToAdd = '"/'+accessPointNameRoute+'/"'
                  }
                  else{
                    routeToAdd = '"/'+accessPointNameRoute+'"'
                  }
                  templateFile = templateFile.replace(new RegExp("{route}", 'g'), routeToAdd );
                  templateFile = templateFile.replace(new RegExp("{verbs}", 'g'), JSON.stringify(accessPointVerbsArray) );
  
                  fse.ensureFileSync( fPath );
                  fse.writeFileSync(fPath, templateFile );
  
                  // fse.outputFileSync(fPath, templateFile)
                  result.push(fileStats);

                }

            });
            return result;
        };

        // traverse(process.cwd()+'/src/modules'+);
        traverse(destinationDirectory);

        // VALIDATE TO ONLY WRITE ONCE
        let spvInfo = fse.readJsonSync(process.cwd()+'/spv.json')
        let accessPointsToAdd = [];
        spvInfo.accessPoints.forEach(function(itm, idx){
          if (itm.name != accessPointName ){
            accessPointsToAdd.push(itm);
          }
        })
        accessPointsToAdd.push({ "name" : accessPointName });
        spvInfo.accessPoints = accessPointsToAdd;
        fse.writeJsonSync( process.cwd()+'/spv.json', spvInfo, {spaces: 2} )


        console.log()
        console.log('your REST MODULE', accessPointName, 'was installed. try it !')
        console.log()
        console.log('Step 1: node .')
        console.log()
        console.log('Step 2: ')
        console.log()
        accessPointVerbsArray.forEach(function(itm, idx){
          
          console.log('curl --request', itm ,'http://localhost:3000/'+accessPointNameRoute)
        })
        console.log('')

  })
  .help()
  .argv
