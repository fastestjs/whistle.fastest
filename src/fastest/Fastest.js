// 通过 id 查询到配置
// const fastestConfig = {
//     id: 1,
//     originDomain: 'now.qq.com',
//     testDomain: 'fastest2.now.qq.com',
//     rulesFromFastest: [''],
//     rulesFromCustom: [
//         'now.qq.com 10.100.64.201', // 用户自己配置
//         'now.qq.com/cgi-bin 10.100.64.201', // 用户自己配置
//         '11.url.cn 10.100.64.201', // 用户自己配置，且与主域一致
//         '88.url.cn 10.100.64.136' // 用户自己配置，且与主域不一致，fastest不改动
//     ]
// };

class Fastest {
    constructor(proxyEnv, ctx) {
        this.proxyEnv = proxyEnv;
        this.ctx = ctx;
    }

    convertRequest() {
        return new Promise((resolve, reject) => {
            const requestUrl = this.ctx.request.url;
            const { originDomain, proxyDomain, rules } = this.proxyEnv;

            // 重新请求规则
            const rewriteOpts = {
                host: originDomain,
                url: requestUrl
            };

            //--------------------------------------------------
            // begin: 遍历 rulesFromCustom 进行替换
            //--------------------------------------------------

            // 举例：静态资源请求要修改回来
            // if (rewriteConfig.url.match(/rewrite\/11_url_cn/)) {
            //     rewriteConfig.host = '11.url.cn';
            //     rewriteConfig.url = rewriteConfig.url.replace(/rewrite\/11_url_cn\//gi, '');
            // }

            // TODO 如果支持用户自定义输入，则这里可能需要限制下书写规范，或者看看 whistle 是怎么识别哪些是 pattern
            // 我们假设限制都是只支持 host 方式的配置
            rulesFromCustom.forEach((rule) => {
                const arr = rule.trim().split(/\s+/);
                const pattern = arr[0];

                // 如果是修改 host 场景
                if (fastestProxy.isMatchVHost(rewriteOpts.url, pattern)) {
                    // 注意 pattern 不一定是域名，可能包含路径
                    rewriteOpts.host = pattern.split('/')[0];
                    rewriteOpts.url = fastestProxy.removeVHost(rewriteOpts.url, pattern);
                }

                // TODO 要考虑请求转发的场景

            });

            //--------------------------------------------------
            // end:遍历 rulesFromCustom进行替换
            //--------------------------------------------------

            // 重要 fullUrl 一定要修改，因为后续 urlParse 的时候是拿这个值处理的
            rewriteOpts.fullUrl = `http://${rewriteOpts.host}${rewriteOpts.url}`;

            resolve(rewriteOpts);
        });
    }


}