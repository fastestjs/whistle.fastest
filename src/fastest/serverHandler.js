const Fastest = require('./Fastest');

exports.handleRequest = async (ctx, next) => {
    // https://github.com/whistle-plugins/whistle.script#%E6%93%8D%E4%BD%9C%E8%AF%B7%E6%B1%82
    console.log('handleRequest start', ctx.fullUrl);

    // Object.keys(ctx.request) = [ 'app', 'req', 'res', 'ctx', 'response', 'originalUrl' ]
    //  ctx.request.originalUrl === ctx.request.url
    // ctx.request = {
    //     method: 'GET',
    //     url: '/_fst_/now_qq_com/_fst_/badjs/10086',
    //     header: {
    //         host: 'fastest2.now.qq.com',
    //         pragma: 'no-cache',
    //         'cache-control': 'no-cache',
    //         'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
    //         accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
    //         referer: 'http://fastest2.now.qq.com/demo/ivweb-startkit/index.html?now_n_http=1&_fst_idx=37',
    //         'accept-encoding': 'gzip',
    //         'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    //         cookie: 'pgv_info=ssid=s8593686160; pgv_pvid=2097970460; pgv_pvi=5417452544; pgv_si=s3195868160; pt2gguin=o2067779134; uin=o2067779134; skey=@UZoqNvcWu; RK=h2p8MidUOK; ptcz=28375b663e8874e796216ac8f9c26354a865d433b986105b98b66e7f3cb79b44; luin=o2067779134; lskey=0001000001a77bb0770e75e5aa8fc5c40f35e920b8eba1c10e1e343f41f7b2c02575f8588785cc754259b4c1; _supWebp=1; _fst_idx=34',
    //         connection: 'keep-alive',
    //         'x-whistle-req-id': '1546011295119-9',
    //         'x-whistle-full-url': 'http%3A%2F%2Ffastest2.now.qq.com%2F_fst_%2Fnow_qq_com%2F_fst_%2Fbadjs%2F10086',
    //         'x-whistle-client-port-1546011283272-82368-6783': '56926'
    //     }
    // };

    // 创建 fastest
    const fastest = new Fastest(ctx.options.proxyEnv, {
        fullUrl: ctx.fullUrl,
        url: ctx.request.originalUrl || ctx.request.url,
        method: ctx.request.method,
        header: ctx.request.header
    });

    // 处理本次请求，分析并获取请求转发的参数
    const proxyRequestOpts = await fastest.proxyRequest();
    // console.log('--proxyRequestOpts--', proxyRequestOpts);

    // 重要 fullUrl 一定要修改，因为后续 whistle 在调用 urlParse 方法时是拿这个值处理的
    ctx.fullUrl = proxyRequestOpts.fullUrl;

    // 发送转发请求，注意一定要设置好代理
    const svrRes = await next({ proxyUrl: fastest.proxyEnv.whistleServer });

    // 设置当次请求的结果
    fastest.setSvrRes(svrRes);

    // 修改 html/js/css 文件，包括静态资源等路径修改
    if (fastest.isHTML() || fastest.isJavaScript() || fastest.isCss()) {
        console.log(fastest.getContentType(), '====isHTML or isJavaScript or isCss=======');

        // 获取HTML文件内容
        const content = await ctx.getResText();

        // html 和静态文件处理不一样
        const callRewrite = fastest.isHTML() ? fastest.getRewriteHtml : fastest.getRewriteStatic;

        // 获取改写后的结果
        const rewriteResult = await callRewrite.call(fastest, content, ctx);

        // 修改响应内容
        ctx.body = rewriteResult.body; // 修改响应内容

        // 可以设置一些自定义的响应头
        ctx.set(rewriteResult.header);
    } else {
        console.log(fastest.getContentType(), '====other=======');
        ctx.set({
            'x-test': 'other',
            'x-fastest-id': fastest.proxyEnv.id
        });
    }

    console.log('handleRequest end');
};