const Koa = require('koa');
const util = require('./util');

module.exports = (server, options) => {
    const app = new Koa();

    app.use(async (ctx) => {
        // 从 ctx 和 options 中获取并设置相关信息
        util.setupContext(ctx, options);

        // fastest://ruleValue
        // console.log(ctx.req.originalReq.ruleValue)

        // ctx.fullUrl = http://fastest2.now.qq.com/demo/ivweb-startkit/index.html?now_n_http=1&_fst_idx=37
        // ctx.reqOptions = {
        //     protocol: null,
        //     slashes: null,
        //     auth: null,
        //     host: null,
        //     port: null,
        //     hostname: null,
        //     hash: null,
        //     search: '?now_n_http=1&_fst_idx=37',
        //     query: 'now_n_http=1&_fst_idx=37',
        //     pathname: '/demo/ivweb-startkit/index.html',
        //     path: '/demo/ivweb-startkit/index.html?now_n_http=1&_fst_idx=37',
        //     href: '/demo/ivweb-startkit/index.html?now_n_http=1&_fst_idx=37',
        //     _raw: '/demo/ivweb-startkit/index.html?now_n_http=1&_fst_idx=37'
        // };

        // 执行自己的业务逻辑
        const { handleRequestRules } = require('./fastest/rulesServerHandler');

        // 处理规则
        await handleRequestRules(ctx);

        // 设置规则
        util.responseRules(ctx);
    });

    server.on('request', app.callback());
};

