const fastestCore = require('./fastest-core');
const Fastest = require('./Fastest');

// 异步请求函数，请求 fastest 服务端接口
function getFastestRewriteHtml(id, htmlContent) {
    return new Promise((resolve, reject) => {
        // 通过 id 查询到配置
        const fastestConfig = {
            id: 1,
            originDomain: 'now.qq.com',
            testDomain: 'fastest2.now.qq.com',
            rulesFromFastest: [''],
            rulesFromCustom: [
                'now.qq.com 10.100.64.201', // 用户自己配置
                'now.qq.com/cgi-bin 10.100.64.201', // 用户自己配置
                '11.url.cn 10.100.64.201', // 用户自己配置，且与主域一致
                '88.url.cn 10.100.64.136' // 用户自己配置，且与主域不一致，fastest不改动
            ]
        };

        console.log('----getFastestRewriteHtml--', id, htmlContent.length);

        // html 文件内容
        let newHtmlContent = htmlContent;

        //------------begin 修改 html 文件的内容--------------
        // 示例：替换静态资源
        // newHtmlContent = newHtmlContent.replace(/11\.url\.cn/gi, 'fastest2.now.qq.com/rewrite/11_url_cn');

        // 如果支持用户自定义输入，则这里可能需要限制下书写规范，或者看看 whistle 是怎么识别哪些是 pattern
        // 我们假设限制都是只支持 host 方式的配置
        fastestConfig.rulesFromCustom.forEach((rule) => {
            const arr = rule.trim().split(/\s+/);
            const pattern = arr[0];
            const operatorURI = arr[1];
            const regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

            // 是否为修改host场景
            const isTypeHost = regIP.test(operatorURI);

            console.log('------', rule, isTypeHost);

            // 如果是修改 host 场景
            if (isTypeHost) {
                newHtmlContent = newHtmlContent.replace(new RegExp(pattern, 'gi'), `${fastestConfig.testDomain}/vhost/${pattern.replace(/\./gi, '_')}/vhost`);
            }

        });

        // 去掉 script 标签上的 integrity 属性，不然会被安全策略阻挡，因为我们的确修改了 html 内容
        newHtmlContent = newHtmlContent.replace(/\s+integrity="[^"]*"/gi, '');

        //------------end 修改 html 文件的内容---------------

        resolve({
            body: newHtmlContent,
            header: {
                'x-test': 'abcd'
            }
        });
    });
}

//  如果Node >= 7.6，可以采用async await的方式
exports.handleRequest = async (ctx, next) => {
    // https://github.com/whistle-plugins/whistle.script#%E6%93%8D%E4%BD%9C%E8%AF%B7%E6%B1%82
    console.log('handleRequest start', ctx.fullUrl);

    const fastest = new Fastest(ctx.options.proxyEnv, ctx);

    // 获取本次的请求该如何转发
    const recoverRequestResult = await fastest.recoverRequest();
    console.log('--recoverRequestResult--', recoverRequestResult);

    // 重要: fullUrl 一定要修改，因为后续 urlParse 的时候是拿这个值处理的
    ctx.fullUrl = recoverRequestResult.fullUrl;

    // 重要: 一定要设置使用 whistle 的代理，否则转发了请求之后，就无法真正获得测试环境的数据了
    const { headers } = await next({ proxyUrl: fastest.proxyEnv.whistleServer });

    // ---------------------------------------------------------------------------
    // begin 传递一些相关信息到 fastest 服务器，来判断如何重新修改结果
    // ---------------------------------------------------------------------------
    // 修改 html 文件，包括静态资源等路径修改
    if (headers && headers['content-type'] && headers['content-type'].indexOf('text/html') > -1) {
        // 获取文件内容
        const resText = await ctx.getResText();

        // 获取改写后的结果
        const rewriteHtml = await getFastestRewriteHtml(fastest.proxyEnv, resText);

        // 修改响应内容
        ctx.body = rewriteHtml.body; // 修改响应内容

        // 可以设置一些自定义的响应头
        ctx.set(ctx.header);
    }

    // TODO 需要修改 js 文件所有请求 now.qq.com 中的地址为 fastest2.now.qq.com

    console.log('handleRequest end');
};