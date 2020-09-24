
"use strict";

const businessLogic     = require("spv-extension-rest").support.businessLogic;

class Users extends businessLogic{
    constructor(req, res, next){
        super(...arguments);

        this.request    = req;
        this.response   = res;
        this.next       = next;
    }
}

module.exports = Users;
