module.exports = (server, options) => {
    server.on('request', (req, res) => {
        console.log('-------------');
        var oReq = req.originalReq;
        var oRes = req.originalRes;

        console.log('--oReq--', oReq);
        console.log('--oRes--', oRes);
    });
};