const Koa = require('koa');
const onerror = require('koa-onerror');

module.exports = (server, options) => {
    const app = new Koa();

    onerror(app);

    app.use(async (ctx, next) => {
        // ctx.request.req.originalReq
        // ctx.request.req.originalRes
        // console.log('--8-ctx.request.req.originalReq----', ctx.request.req.originalReq, ctx.request.req.originalReq.fullUrl);
        // console.log('--8-ctx.request.req.originalRes----', ctx.request.req.originalRes, ctx.request.req.originalReq.fullUrl);
        //
        // ctx.set({
        //     'x-s-ip': ctx.request.req.originalRes.serverIp
        // });

        // console.log('---resRulesServer--ctx--',ctx)
        // console.log('---resRulesServer--options--',options.proxyEnv)

        // 执行自己的业务逻辑
        const { handleResponseRules } = require('./fastest/resRulesServerHandler');

        // 处理规则
        await handleResponseRules(ctx, options);
    });

    server.on('request', app.callback());
};
