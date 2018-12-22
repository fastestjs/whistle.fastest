const fastestUtil = require('./fastest-util');
const Fastest = require('./Fastest');

//  如果Node >= 7.6，可以采用async await的方式
exports.handleRequest = async (ctx, next) => {
    // https://github.com/whistle-plugins/whistle.script#%E6%93%8D%E4%BD%9C%E8%AF%B7%E6%B1%82
    console.log('handleRequest start', ctx.fullUrl);

    // 创建 fastest
    const fastest = new Fastest(ctx.options.proxyEnv, ctx);

    // 处理本次请求，分析并获取请求转发的参数
    const proxyRequestOpts = await fastest.proxyRequest();
    console.log('--proxyRequestOpts--', proxyRequestOpts);

    // 重要 fullUrl 一定要修改，因为后续 whistle 在调用 urlParse 方法时是拿这个值处理的
    ctx.fullUrl = proxyRequestOpts.fullUrl;

    // 发送转发请求，注意一定要设置好代理
    const { headers } = await next({ proxyUrl: fastest.proxyEnv.whistleServer });

    // ---------------------------------------------------------------------------
    // begin 传递一些相关信息到 fastest 服务器，来判断如何重新修改结果
    // ---------------------------------------------------------------------------
    // 修改 html 文件，包括静态资源等路径修改
    if (fastestUtil.isHTML(headers['content-type'])) {
        // 获取HTML文件内容
        const resText = await ctx.getResText();

        // 获取改写后的结果
        const rewriteHtml = await fastest.getRewriteHtml(resText);

        // 修改响应内容
        ctx.body = rewriteHtml.body; // 修改响应内容

        // 可以设置一些自定义的响应头
        ctx.set(ctx.header);
    }

    // TODO 需要修改 js 文件所有请求 now.qq.com 中的地址为 fastest2.now.qq.com

    console.log('handleRequest end');
};