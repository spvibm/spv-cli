/* eslint-disable no-unused-vars, no-undef */
"use strict";

module.exports = `
"use strict";

const commonAccessPoint     = require("spv-rest-extension").support.accessPoint;

class {className} extends commonAccessPoint{
    constructor(router){
        super();
        this.basePath       = {route};
        this.router         = router;
        this.allowedVerbs   = {verbs};
        this.businessLogic  = require("./businessLogic");
    }
}

module.exports = {className};
`;
/* eslint-enable no-unused-vars, no-undef */

