const fastestUtil = require('./fastest-util');

/**
 * 将点号替换为下划线。
 *
 * 例如 11.url.cn -> 11_url_cn
 *
 * @param {String} str 字符串
 * @return {String}
 */
function replaceDotToUnderline(str) {
    return str.replace(/\./gi, '_');
}

/**
 * 判断该请求地址是不是已经使用了 host 重写了请求。
 *
 * 例如：
 * http://fastest2.now.qq.com/vhost/11_url_cn/vhost/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152
 *
 * @param {String} requestUrl 请求的地址
 * @param {String} pattern 要验证的配置项，例如 11.url.cn 或者 now.qq.com/cgi-bin
 * @return {Boolean}
 */
function isMatchVHost(requestUrl, pattern) {
    return !!requestUrl.match(new RegExp(`vhost/${replaceDotToUnderline(pattern)}/vhost/`));
}

/**
 * 将包含了 fastest vhost 标记的url替换为原始的请求地址
 *
 * @param {String} requestUrl 请求的地址
 * @param {String} pattern 要验证的配置项，例如 11.url.cn 或者 now.qq.com/cgi-bin
 * @return {String}
 */
function removeVHost(requestUrl, pattern) {
    return requestUrl.replace(new RegExp(`vhost/${replaceDotToUnderline(pattern)}/vhost/`, 'gi'), '');
}

/**
 * 将包含了 fastest vhost 标记的url替换为原始的请求地址
 *
 * @param {String} content 内容
 * @param {String} pattern 要验证的配置项，例如 11.url.cn 或者 now.qq.com/cgi-bin
 * @param {String} testDomain 测试域名，例如 fastest2.now.qq.com
 * @return {String}
 */
function addVHost(content, pattern, testDomain) {
    return content.replace(new RegExp(pattern, 'gi'), `${testDomain}/vhost/${replaceDotToUnderline(pattern)}/vhost`);
}

// 异步请求函数，请求 fastest 服务端接口
function getRewriteHtml(htmlContent, opts = {}) {
    return new Promise((resolve, reject) => {
        const { testDomain, rulesFromCustom } = opts;

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

        // html 文件内容
        let newHtmlContent = htmlContent;

        //------------begin 修改 html 文件的内容--------------
        // 示例：替换静态资源
        // newHtmlContent = newHtmlContent.replace(/11\.url\.cn/gi, 'fastest2.now.qq.com/rewrite/11_url_cn');

        // 如果支持用户自定义输入，则这里可能需要限制下书写规范，或者看看 whistle 是怎么识别哪些是 pattern
        // 我们假设限制都是只支持 host 方式的配置
        rulesFromCustom.forEach((rule) => {
            const ruleInfo = fastestUtil.parseWhistleRule(rule);

            // 是否为修改host场景
            const isTypeHost = fastestUtil.isIP(ruleInfo.operatorURI);

            console.log('------', rule, isTypeHost, ruleInfo);

            // 如果是修改 host 场景
            if (isTypeHost) {
                newHtmlContent = addVHost(newHtmlContent, ruleInfo.pattern, testDomain);
            }

            // TODO 还需要考虑配置转发的场景

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

module.exports = {
    replaceDotToUnderline,
    isMatchVHost,
    removeVHost,
    addVHost,
    getRewriteHtml
};
