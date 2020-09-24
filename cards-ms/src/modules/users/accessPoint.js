
"use strict";

const commonAccessPoint     = require("spv-rest-extension").support.accessPoint;

class Users extends commonAccessPoint{
    constructor(router){
        super();
        this.basePath       = "/users/";
        this.router         = router;
        this.allowedVerbs   = ["GET","POST","PUT"];
        this.businessLogic  = require("./businessLogic");
    }
}

module.exports = Users;
