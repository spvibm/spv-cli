
"use strict";

const businessLogic     = require("xdome-extension-rest").support.businessLogic;

class users extends businessLogic{
    constructor(req, res, next){
        super(...arguments);

        this.request    = req;
        this.response   = res;
        this.next       = next;
    }
}

module.exports = users;
