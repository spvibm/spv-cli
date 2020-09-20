
"use strict";
const commonAccessPoint     = require("xdome-extension-rest").support.accessPoint;

class users extends commonAccessPoint{
    constructor(router){
        super();
        this.basePath       = "/users";
        this.router         = router;
        this.allowedVerbs   = ["GET", "POST"];
        this.businessLogic  = require("./businessLogic");
    }
}
module.exports = users;