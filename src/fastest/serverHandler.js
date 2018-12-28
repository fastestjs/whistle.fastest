const fastestUtil = require('./fastest-util');
const Fastest = require('./Fastest');

exports.handleRequest = async (ctx, next) => {
    // https://github.com/whistle-plugins/whistle.script#%E6%93%8D%E4%BD%9C%E8%AF%B7%E6%B1%82
    console.log('handleRequest start', ctx.fullUrl);

    // 创建 fastest
    const fastest = new Fastest(ctx.options.proxyEnv);

    // 处理本次请求，分析并获取请求转发的参数
    const proxyRequestOpts = await fastest.proxyRequest(ctx.request.url);
    // console.log('--proxyRequestOpts--', proxyRequestOpts);

    // 重要 fullUrl 一定要修改，因为后续 whistle 在调用 urlParse 方法时是拿这个值处理的
    ctx.fullUrl = proxyRequestOpts.fullUrl;

    // 发送转发请求，注意一定要设置好代理
    const svrRes = await next({ proxyUrl: fastest.proxyEnv.whistleServer });

    // 设置当次请求的结果
    fastest.setSvrRes(svrRes);

    // 修改 html 文件，包括静态资源等路径修改
    if (fastest.isHTML()) {
        // 获取HTML文件内容
        const htmlContent = await ctx.getResText();

        // 获取改写后的结果
        const rewriteHtml = await fastest.getRewriteHtml(htmlContent, ctx);

        // 修改响应内容
        ctx.body = rewriteHtml.body; // 修改响应内容

        // 可以设置一些自定义的响应头
        ctx.set(rewriteHtml.header);
    }

    // TODO 需要修改 js 文件所有请求 now.qq.com 中的地址为 fastest2.now.qq.com

    console.log('handleRequest end');
};