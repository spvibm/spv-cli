"use strict";

const path                  = require('path');

module.exports              = {
    paths                   : {
        templates           : path.join(__dirname, 'templates'),
        support             : path.join(__dirname, 'support'),
        plugin              : path.join(__dirname, 'plugin'),
    },
    templates               : {
        accessPoint         : require('./templates/accessPoint'),
        businessLogic       : require('./templates/businessLogic'),
    },
    support                 : {
        accessPoint         : require('./support/accessPoint'),
        businessLogic       : require('./support/businessLogic'),
    },
    plugin                  : {
        accessPoint         : require('./plugin/accessPoints'),
    },
};
