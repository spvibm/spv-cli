"use strict";

class commonAccessPoint {
    constructor(){ }

    setRoutes(){
        this.commonEntryRoutes();

        if(this.routesOverride){
            for(let route in this.routesOverride){
                const verb      = this.routesOverride[route].method.toLowerCase();
                const callback  = this.routesOverride[route].callback;
                this.commonAccessPointRoute(verb, callback);
            }
        }

        this.allowedVerbs.forEach((verb)=>{
            verb = verb.toLowerCase()
            this.commonAccessPointRoute(verb);
        });

        this.rejects();
    }

    commonEntryRoutes(){
        this.router.route(`${this.basePath}*`)
            .all((req, res, next)=>{
                req.dome = {};
                res.dome = {};
                /* @TODO: Set request id */
                next();
            });
    }

    rejects(){
        this.router.route(`${this.basePath}*`)
            .all((req, res/*, next*/)=>{
                /* @TODO: Get response from custom factory*/
                /* @TODO: Check for method reject and other rejects*/
                res.status(500).json({
                    success: false,
                    data: {},
                    message: "Method Not Allowed",
                })
            });
    }

    commonAccessPointRoute(verb, callbackName){
        const self = this;

        callbackName = (callbackName)
            ? callbackName
            : verb;

        this.router.route(`${this.basePath}`)[verb](function(req, res){
            req.dome = {};
            res.dome = {};
            const businessLogicInstance = new self.businessLogic(...arguments);
            businessLogicInstance[callbackName](...arguments);
        });
    }
}

module.exports = commonAccessPoint;
