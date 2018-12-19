const fastestProxy = require('./fastest-proxy');

/**
 * 获取转发路由等配置信息，以便获知本次请求该如何转发。
 *
 * @param {Object} opts 参数
 * @param {String} opts.originDomain 原始域名
 * @param {Array} opts.rulesFromCustom 用户自己配置的代理规则
 * @param {String} opts.requestUrl 请求的地址
 * @return {Promise<any>}
 */
function getFastestRewriteConfig(opts) {
    return new Promise((resolve, reject) => {
        const { originDomain, rulesFromCustom, requestUrl } = opts;

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

        // 重新请求规则
        const rewriteConfig = {
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
            if (fastestProxy.isMatchVHost(rewriteConfig.url, pattern)) {
                // 注意 pattern 不一定是域名，可能包含路径
                rewriteConfig.host = pattern.split('/')[0];
                rewriteConfig.url = rewriteConfig.url.replace(new RegExp(`vhost/${pattern}/vhost/`, 'gi'), '');
            }

            // TODO 要考虑 rewrite 场景

        });

        //--------------------------------------------------
        // end:遍历 rulesFromCustom进行替换
        //--------------------------------------------------

        // 重要 fullUrl 一定要修改，因为后续 urlParse 的时候是拿这个值处理的
        rewriteConfig.fullUrl = `http://${rewriteConfig.host}${rewriteConfig.url}`;

        resolve(rewriteConfig);
    });
}

module.exports = {
    getFastestRewriteConfig
};