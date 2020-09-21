"use strict";

const inputActions             = {
    "get"                      : { schemeValidationFunction : "getInputSchemeValidator",      schemeTransformProcess : "getInputOverride" },
    "post"                     : { schemeValidationFunction : "postInputSchemeValidator",     schemeTransformProcess : "postInputOverride" },
    "put"                      : { schemeValidationFunction : "putInputSchemeValidator",      schemeTransformProcess : "putInputOverride" },
    "delete"                   : { schemeValidationFunction : "deleteInputSchemeValidator",   schemeTransformProcess : "deleteInputOverride" },
};
const outputActions            = {
    "get"                      : { schemeValidationFunction : "getOutputSchemeValidator",      schemeTransformProcess : "getOutputOverride" },
    "post"                     : { schemeValidationFunction : "postOutputSchemeValidator",     schemeTransformProcess : "postOutputOverride" },
    "put"                      : { schemeValidationFunction : "putOutputSchemeValidator",      schemeTransformProcess : "putOutputOverride" },
    "delete"                   : { schemeValidationFunction : "deleteOutputSchemeValidator",   schemeTransformProcess : "deleteOutputOverride" },
};

class commonBusinessLogic {

    /* eslint-disable no-unused-vars, brace-style */
    constructor(req, res, next){}

    async getInputSchemeValidator(data){ return true; }
    async getOutputSchemeValidator(data){ return true; }
    async getInputOverride(data){ this.request.dome.input = data; }
    async getOutputOverride(data){ this.response.dome.output = data; }
    async getProcess(){ return { data : "get" }; }
    async get(){
        let isValidInput                = await this.schemeProcess("input", "get", this.request);

        if(isValidInput){
            let responseData            = await this.getProcess(),
                isValidOutput           = await this.schemeProcess("output", "get", responseData);

            if(isValidOutput && !this.response.headersSent){
                if(!this.getResponseOverride){
                    this.response.status(200).json(this.response.dome.output);
                }
                else{
                    this.getResponseOverride();
                }
            }
        }
    }

    async postInputSchemeValidator(data){ return true; }
    async postOutputSchemeValidator(data){ return true; }
    async postInputOverride(data){ this.request.dome.input = data; }
    async postOutputOverride(data){ this.response.dome.output = data; }
    async postProcess(){ return { data : "post" }; }
    async post(){
        let isValidInput                = await this.schemeProcess("input", "post", this.request);

        if(isValidInput){
            let responseData            = await this.postProcess(),
                isValidOutput           = await this.schemeProcess("output", "post", responseData);

            if(isValidOutput && !this.response.headersSent){
                if(!this.postResponseOverride){
                    this.response.status(200).json(this.response.dome.output);
                }
                else{
                    this.postResponseOverride();
                }
            }
        }
    }

    async putInputSchemeValidator(data){ return true; }
    async putOutputSchemeValidator(data){ return true; }
    async putInputOverride(data){ this.request.dome.input = data; }
    async putOutputOverride(data){ this.response.dome.output = data; }
    async putProcess(){ return { data : "put" }; }
    async put(){
        let isValidInput                = await this.schemeProcess("input", "put", this.request);

        if(isValidInput){
            let responseData            = await this.putProcess(),
                isValidOutput           = await this.schemeProcess("output", "put", responseData);

            if(isValidOutput && !this.response.headersSent){
                if(!this.putResponseOverride){
                    this.response.status(200).json(this.response.dome.output);
                }
                else{
                    this.putResponseOverride();
                }
            }
        }
    }

    async deleteInputSchemeValidator(data){ return true; }
    async deleteOutputSchemeValidator(data){ return true; }
    async deleteInputOverride(data){ this.request.dome.input = data; }
    async deleteOutputOverride(data){ this.response.dome.output = data; }
    async deleteProcess(){ return { data : "delete" }; }
    async delete(){
        let isValidInput                = await this.schemeProcess("input", "delete", this.request);

        if(isValidInput){
            let responseData            = await this.deleteProcess(),
                isValidOutput           = await this.schemeProcess("output", "delete", responseData);

            if(isValidOutput && !this.response.headersSent){
                if(!this.deleteResponseOverride){
                    this.response.status(200).json(this.response.dome.output);
                }
                else{
                    this.deleteResponseOverride();
                }
            }
        }
    }

    async schemeProcess(type, method, data){
        let result              = false,
            actions             = (type==="input")?inputActions:outputActions,
            isValidStructure    = await this[actions[method].schemeValidationFunction](data);

        if(isValidStructure){
            await this[actions[method].schemeTransformProcess](data);
            result              = true;
        }
        else{
            this.response.status(500).json({
                success                : false,
                data                   : {},
                message                : `check your ${type} structure / scheme`,
            });
        }

        return result;
    }
}

module.exports = commonBusinessLogic;
