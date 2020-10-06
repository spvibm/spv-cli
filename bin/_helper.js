
"use strict";
const Messages = new (require('./messages'));
const fse = require('fs-extra');
const fs = require('fs');

class Helper{
    constructor(){
    }

    createRestModule(options){

        const template_path = require("spv-extension-rest").paths;
        let accessPointName = options.name;
        let accessPointVerbsArray = options.verbs;
        let accessPointNameRoute = options.route;
        let destinationDirectory;
    
        // validate we are in the root of a spv project 
        if ( !fs.existsSync(process.cwd()+'/spv.json') ) {
          console.log("")
          console.log("Por favor valida que estás ejecutando este comando dentro de un proyecto Supervielle")
          console.log("")
          return 
        };
    
        // validate we find modules folder
        if ( !fs.existsSync(process.cwd()+'/src/modules') ) {
          console.log("")
          console.log("El instalador no encontró la carpeta 'src/modules'")
          console.log("")
          return 
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
                  let fPath = path.resolve(dir, file);
          
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
    
          Messages.onRESTModuleCreated(accessPointName, accessPointVerbsArray, spvInfo, accessPointNameRoute);
    

    }
    
    createRestModulesFromSwaggerJson(swaggerJson){
        // ToDo: refactorizar esta función; es muy compleja ...

        let pathsArr = Object.keys(swaggerJson.paths);
        const self = this;

        pathsArr.forEach(function(itm, idx){

            let routesArr = Object.keys(swaggerJson.paths);

            routesArr.forEach(function(item1, index1){

                let routeName = item1.substring(1); 

                let routesArr = Object.keys(swaggerJson.paths);

                routesArr.forEach(function(item2, index2){
                    let verbsArr = Object.keys(swaggerJson.paths[item1]);
                    let verbsArrUppercased = verbsArr.map(x => x.toUpperCase());

                    self.createRestModule({ 
                    name: routeName , 
                    verbs: verbsArrUppercased , 
                    route: routeName 
                    });

                });

            });

        });

    }
}

module.exports = Helper;
