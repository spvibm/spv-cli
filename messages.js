
"use strict";

class Messages{
    constructor(req, res, next){
    }

    onProjectCreated(name, projectName){
        console.log()
        console.log('Tu proyecto', name, 'fue creado con éxito!')
        console.log()
        console.log('Para iniciar tu aplicación, ejecuta:')
        console.log()
        console.log('cd ', projectName)
        console.log()
        console.log('npm install')
        console.log()
        console.log('node .')
        console.log()
    }

    onRESTModuleCreated(accessPointName, accessPointVerbsArray, spvInfo, accessPointNameRoute){
        console.log()
        console.log('Tu módulo REST', accessPointName, 'fue instalado. Probalo !')
        console.log()
        console.log('Paso 1. Ejecuta: node .')
        console.log()
        console.log('Paso 2. Ejecuta alguna petición CURL:')
        console.log()
        accessPointVerbsArray.forEach(function(itm, idx){
          console.log('curl --request', itm ,'http://localhost:3000'+ spvInfo.basePath + accessPointNameRoute)
        })
        console.log('')
    }
    
}

module.exports = Messages;
