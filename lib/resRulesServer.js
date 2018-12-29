'use strict';

module.exports = function (server, options) {
    server.on('request', function (req, res) {
        console.log('-------------');
        var oReq = req.originalReq;
        var oRes = req.originalRes;

        console.log('--oReq--', oReq);
        console.log('--oRes--', oRes);
    });
};