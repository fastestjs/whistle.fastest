const Koa = require('koa');
const util = require('./util');

module.exports = (server, options) => {

    // Object.keys(server)=[ 'domain',
    //     '_events',
    //     '_eventsCount',
    //     '_maxListeners',
    //     '_connections',
    //     '_handle',
    //     '_usingSlaves',
    //     '_slaves',
    //     '_unref',
    //     'allowHalfOpen',
    //     'pauseOnConnect',
    //     'httpAllowHalfOpen',
    //     'timeout',
    //     'keepAliveTimeout',
    //     '_pendingResponseData',
    //     'maxHeadersCount',
    //     '_connectionKey' ]

    const app = new Koa();

    app.use(async (ctx) => {
        // 从 ctx 和 options 中获取并设置相关信息
        util.setupContext(ctx, options);

        // 从 url 中获取指定参数
        // ctx.query['_fst_idx']=37

        // 从 cookie 中获取指定参数
        // ctx.cookies.get('_fst_idx')=37

        // Object.keys(ctx) = [ 'request',
        //   'response',
        //   'app',
        //   'req',
        //   'res',
        //   'originalUrl',
        //   'state',
        //   'options',
        //   'reqOptions',
        //   'fullUrl' ]

        // console.log('ctx.cookies=', ctx.cookies);
        // ctx.app = { subdomainOffset: 2, proxy: false, env: 'development' };

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

        // console.log('ctx.req.headers:', ctx.req.headers);
        // ctx.req.headers = { host: 'fastest2.now.qq.com',
        //   pragma: 'no-cache',
        //   'cache-control': 'no-cache',
        //   'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        //   accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
        //   referer: 'http://fastest2.now.qq.com/demo/ivweb-startkit/index.html?now_n_http=1&_fst_idx=37',
        //   'accept-encoding': 'gzip, deflate',
        //   'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        //   cookie: '_supWebp=1',
        //   'x-whistle-req-id': '1546000678915-365',
        //   'x-whistle-full-url': 'http%3A%2F%2Ffastest2.now.qq.com%2Ffavicon.ico',
        //   'x-forwarded-for': '127.0.0.1',
        //   'x-whistle-client-port-1546000375942-49568-5489': '49890',
        //   'x-whistle-method': 'GET',
        //   'x-whistle-rule-value': 'hahahahahahahahahahha',
        //   connection: 'close' };

        // 执行自己的业务逻辑
        const { handleRequestRules } = require('./fastest/rulesServerHandler');

        // 处理规则
        await handleRequestRules(ctx);

        // 设置规则
        util.responseRules(ctx);
    });

    server.on('request', app.callback());
};

