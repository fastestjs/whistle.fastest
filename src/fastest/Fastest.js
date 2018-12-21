const _ = require('lodash');

class Fastest {
    constructor(proxyEnv, ctx) {
        this.proxyEnv = proxyEnv;
        this.ctx = ctx;
    }

    convertRequest() {
        return new Promise((resolve, reject) => {
            const requestUrl = this.ctx.request.url;
            const { originDomain, rules } = this.proxyEnv;

            // 重新请求规则
            let rewriteOpts = {
                host: originDomain,
                url: requestUrl
            };

            //--------------------------------------------------
            // begin: 遍历 rules 进行替换
            //--------------------------------------------------
            // TODO 如果支持用户自定义输入，则这里可能需要限制下书写规范，或者看看 whistle 是怎么识别哪些是 pattern
            // 我们假设限制都是只支持 host 方式的配置
            for (let i = 0; i < rules.length; i++) {
                let rule = rules[i];

                // 如果当前的请求链接是追加了 host 的场景，则需要将 host 信息解析出来
                if (rule.isProxyTypeOfHost(rewriteOpts.url)) {
                    rewriteOpts = _.merge({}, rewriteOpts, rule.getProxyTypeOfHostResult(rewriteOpts.url));
                    break;
                }

                // TODO 要考虑请求转发的场景
            }

            //--------------------------------------------------
            // end: 遍历 rules 进行替换
            //--------------------------------------------------

            // 重要 fullUrl 一定要修改，因为后续 urlParse 的时候是拿这个值处理的
            rewriteOpts.fullUrl = `http://${rewriteOpts.host}${rewriteOpts.url}`;

            resolve(rewriteOpts);
        });
    }

}