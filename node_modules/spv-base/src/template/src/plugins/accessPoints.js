"use strict";

class accessPoints {
    constructor(express, accessPointList){
        this.router                 = express.Router();
        this.accessPointList        = accessPointList;
    }

    setRoutes(){
        this.accessPointList.forEach((accessPoint)=>{
            /* @TODO - Resolve the 'modules' relative path inside a real project */
            let accessPointInstance = new (require(`./../modules/${accessPoint.name}/accessPoint`))(this.router);
            accessPointInstance.setRoutes();
        });
    }
}

module.exports = accessPoints;