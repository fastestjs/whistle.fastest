const Koa = require('koa');
const _ = require('./util');

module.exports = (server, opts) => {
    const app = new Koa();

    app.use(async (ctx, next) => {
        _.request(ctx, { proxyUrl: 'http://127.0.0.1:8899' });
        // await next();
    })
    server.on('request', app.callback())
}