const fastestUtil = require('./fastest-util');

/**
 * 判断该请求地址是不是已经使用了 host 重写了请求。
 *
 * 例如：
 * http://fastest2.now.qq.com/_fst_/11_url_cn/_fst_/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152
 *
 * @param {String} requestUrl 请求的地址
 * @param {String} pattern 要验证的配置项，例如 11.url.cn 或者 now.qq.com/cgi-bin
 * @return {Boolean}
 */
function isMatchVHost(requestUrl, pattern) {
    return !!requestUrl.match(new RegExp(`_fst_/${fastestUtil.replaceDotToUnderline(pattern)}/_fst_/`));
}

/**
 * 将包含了 fastest _fst_ 标记的url替换为原始的请求地址
 *
 * @param {String} requestUrl 请求的地址
 * @param {String} pattern 要验证的配置项，例如 11.url.cn 或者 now.qq.com/cgi-bin
 * @return {String}
 */
function removeVHost(requestUrl, pattern) {
    return requestUrl.replace(new RegExp(`_fst_/${fastestUtil.replaceDotToUnderline(pattern)}/_fst_/`, 'gi'), '');
}

/**
 * 将原始的请求地址进行部分替换，根据规则匹配项，加上 fastest _fst_ 标记
 *
 * @param {String} content 内容
 * @param {String} pattern 要验证的配置项，例如 11.url.cn 或者 now.qq.com/cgi-bin
 * @param {String} proxyDomain 测试域名，例如 fastest2.now.qq.com
 * @return {String}
 */
function addVHost(content, pattern, proxyDomain) {
    const newContent = content.replace(new RegExp(pattern, 'gi'), `${proxyDomain}/_fst_/${fastestUtil.replaceDotToUnderline(pattern)}/_fst_`);

    // 发现一旦重复替换了，则放弃
    if (new RegExp('_fst_/_fst_', 'gi').test(newContent)) {
        return content;
    }

    return newContent;
}

/**
 * 将原始的请求地址进行部分替换，根据所有的规则匹配项，加上 fastest _fst_ 标记
 *
 * @param {String} content 内容
 * @param {Array} rules 规则数组，子元素结构详见 ProxyRule.js
 * @param {String} proxyDomain 测试域名，例如 fastest2.now.qq.com
 * @return {String}
 */
function addAllVHost(content, rules, proxyDomain) {
    // 1. 获取 html 文件内容
    let newContent = content;

    // 2. 根据规则，依次进行转发替换，将匹配的请求转发到 fastest 上
    for (let i = 0; i < rules.length; i++) {
        let rule = rules[i];

        newContent = addVHost(newContent, rule.pattern, proxyDomain);
    }

    return newContent;
}

/**
 * 去掉 script 标签上的 integrity 属性，不然会被安全策略阻挡，因为我们的确修改了 html 内容
 *
 * @param {String} content 内容
 * @return {String}
 */
function removeIntegrityForHtml(content) {
    return fastestUtil.removeIntegrityForHtml(content);
}

module.exports = {
    isMatchVHost,
    removeVHost,
    addVHost,
    addAllVHost,
    removeIntegrityForHtml
};
