"use strict";

const util = require("fs");
const fse = require("fs-extra");

class Helper {
    constructor(){

        this.getFileSystemBlueprint = function(basePath){
            return fse.readJsonSync(basePath+'/fileSystemBlueprint.json');
        }

        this.getFileTemplateByID = function(basePath, fileId){
            let fileName = fileId // + '.js';
            return require(basePath + '/templates/' + fileName);
        }

        // this.validateCommandParameters = function(){ }

        this.createFile = function(filePath, fileContent, config) {
            // console.log('executing createFile function')
            fse.ensureFileSync( process.cwd() + filePath );
            fse.writeFileSync(
                process.cwd() + filePath,
                fileContent //JSON.stringify(fileContent)
            );
        }
            
        this.createDir = function(dirPath, dirName) {
            // console.log('executing createDir function')
            // console.log(process.cwd() + '/' + dirPath + '/' + dirName)
            fse.ensureDirSync( process.cwd() + '/' + dirPath + '/' + dirName     );
        }

        this.createFileSystemElements  = function(itm, currentDirPath, blueprintObject, cliParamsArr, pluginBasePath, currentIndex){

            let self = this;
            let valueMarkers = [];

            if (cliParamsArr.length == 0 ) {
                // handle missing params error
            }
            else{

                if (blueprintObject.cliParamsConfig.length == 0) {                    
                    // return // handle missing params error
                }

                cliParamsArr.forEach(function(cliParamItm, cliParamIdx){

                    let paramConfig = blueprintObject.cliParamsConfig.filter(function(el) {
                        let position = cliParamIdx + 1;
                        return el.entryPosition === position;
                    })[0];
                    
                    paramConfig.valueMarker.forEach(function(paramConfigItm, paramConfigIdx){
                        let valuetoAdd = (paramConfig.hasOwnProperty('commandPrefix') && paramConfig.commandPrefix.length > 0)? 
                        cliParamItm.replace( paramConfig.commandPrefix + "=" , "" ) : cliParamItm;

                        let toAdd = {
                            valueMarkerName : paramConfigItm, 
                            value: valuetoAdd
                        }
                        valueMarkers.push(toAdd)
                    })

                });

            }

            if (itm.hasOwnProperty('type') && (itm.type === 'dir' || itm.type === 'folder') ) { 

                let dirData = itm;

                let dirName;

                if ( dirData.hasOwnProperty('name') && typeof dirData.name === 'object' && dirData.name.hasOwnProperty('valueMarker') ) {

                    dirName = valueMarkers.find(el => {
                        return el.valueMarkerName === dirData.name.valueMarker
                    }).value;

                }
                else{
                    dirName = dirData.name;
                };
                    

                let dirPath = currentDirPath;
                                            
                this.createDir(dirPath, dirName);


                if (dirData.hasOwnProperty('child_elements')) {

                    let nestedDirPath = dirPath + "/" + dirName;

                    dirData.child_elements.forEach(function(subItm, subIdx){
                        self.createFileSystemElements(subItm, nestedDirPath, blueprintObject, cliParamsArr, pluginBasePath, currentIndex+1)
                    })

                };

            }
            else if (itm.hasOwnProperty('type') && itm.type === 'file') { 
                // console.log("itm.hasOwnProperty('type') && itm.type === 'file'");
                let fileData = itm;
                let templateFile;

                let fileName;
                let fileExtension = '';

                if ( fileData.hasOwnProperty('fileExtension') ) {
                    fileExtension = fileData.fileExtension;
                }

                if ( fileData.hasOwnProperty('name') && typeof fileData.name === 'object' && fileData.name.hasOwnProperty('valueMarker') ) {

                    fileName = valueMarkers.find(el => {
                        return el.valueMarkerName === fileData.name.valueMarker
                    }).value;

                }
                else{
                    fileName = fileData.name;
                };

                let templateId = ( fileData.hasOwnProperty('template_id') )? fileData.template_id: false;

                if (templateId != undefined ) {
                    templateFile = self.getFileTemplateByID(pluginBasePath, templateId)
                }
                else {
                    // handle no templateId error
                }

                if (templateFile != undefined) {
                    // handle error
                }

                if ( fileData.hasOwnProperty('params') && fileData.params.length > 0 ) {

                    fileData.params.forEach(function(paramItm, paramIdx){
                        
                        let placeholder = paramItm.placeholder;

                        let value = valueMarkers.find(el => {
                            return el.valueMarkerName === paramItm.valueMarker
                        }).value;

                        templateFile = templateFile.replace(new RegExp(placeholder, 'g'), value );

                    })

                    let fileContent = templateFile;

                    let filePath = currentDirPath + "/" + fileName + fileExtension;

                    self.createFile(filePath, fileContent, {});
                }

            } 

        };

        this.createFileSystemFromBluePrint = function( pluginBasePath, blueprintObject, cliParamsArr ){

            let self = this;

            let elements = blueprintObject.elements || []; 
            if (elements.length == 0 ){
                return console.log('no actions to perform for this plugin template. check the plugin template structure. "elements" should be added there')
            }

            blueprintObject["cliParams"] = ( blueprintObject.hasOwnProperty('cliParams') )? blueprintObject.cliParams : [];

            let currentDirPath = ( blueprintObject.hasOwnProperty('rootDir') )? blueprintObject.rootDir : '';

            elements.forEach(function(itm, idx){
                self.createFileSystemElements(itm, currentDirPath, blueprintObject, cliParamsArr, pluginBasePath, 0)
            })
                    
        }


        //////////////////////////////////////////////////////////////////////

        this.pass = function(){
            let message = 'this component is not yet implemented and will be available in a future release version';
            return console.log(message);
        }
    
        this.checkIfCommandIsUndefined = function(commandName){
            let commandIsUndefined = (commandName===undefined)?true:false;
            return commandIsUndefined;
        };
        
        this.checkIfCommandExists = function(commandsList, commandName){
            let commandExists = false;
            return commandExists = commandsList.includes(commandName);
        };
    
        this.printSpacedMessage = function(message){
            console.log('');
            console.log(message);
            console.log('');
        }

        this.convertFirstCharactertoUppercaseRestLowercase = function(string) {
            return string.charAt(0).toUpperCase() + string.toLowerCase().slice(1);
        }
    
        this.isCurrentDirectoryRootFolder = function(){
            if (util.existsSync(process.cwd()+'/package.json')) {
                return { success: true, message: 'it is root' }
            }
            return { success: false, message: 'please navigate to your project root directory' }
        }
    
        this.destinationFolderExists = function(destinationPath){
            let destPath = destinationPath,
                fullPath = process.cwd()+ destPath
            // console.log(fullPath)
            if (util.existsSync(fullPath)) {
                // console.log('destination folder exists')
                // console.log(fullPath)
                return { success: true, message: 'destination folder already exists' }
            }
            // console.log('destination folder doesnt exist')
            return { success: false, message: 'destination folder doesnt exist' }
        }
    
        this.newDirectoryNameIsValid = function(directoryName){
            let isValid = true,
                errorMessage = 'an error ocurred while trying to validate the provided directory name';
    
            if(!directoryName || directoryName === ""){
                isValid = false
                errorMessage = "please provide a directory name.";
                // console.log(directoryName)
            }
            else{
                // check if directoryName have no spaces
                if (/\s/.test(directoryName)) {
                    isValid = false
                    errorMessage = "directory name " + "'" + directoryName + "'" + " should not contain spaces.";
                    console.log(errorMessage)
                }
                // check if directoryName have no special characters
                if (/[~`!#$%\^&*+=\\[\]\\';,/{}|\\":<>\?]/g.test(directoryName)) {
                    isValid = false
                    errorMessage = "directory name " + "'" + directoryName + "'" + " should not contain special characters.";
                    // console.log(errorMessage)
                }
                // check if directoryName already exists
                if (util.existsSync(process.cwd()+'/'+directoryName)) {
                    isValid = false
                    errorMessage = "directory name " + "'" + directoryName + "'" + " already exists.";
                    // console.log(errorMessage)
                }
            }
    
            if (!isValid){
                return { sucess: false, message: errorMessage };
            }
            return { sucess: true, message: 'new directory name is valid'};
        }        



    }

}

module.exports = new Helper();

