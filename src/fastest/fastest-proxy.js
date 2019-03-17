const fastestUtil = require('./fastest-util');

/**
 * URL中用于匹配转发的标记，在标记之间的请求将被进行特殊处理
 *
 * 例如 https://your-proxy-domain/_fst_/11_url_cn/_fst_/xyz.js
 * 将被处理为 https://11.url.cn/xyz.js
 * 同理，如果 11.url.cn 被设置了转发规则，也将被修改为: https://your-proxy-domain/_fst_/11_url_cn/_fst_/xyz.js
 *
 * @type {String}
 */
const MATCH_PROXY_TAG = '_fst_';

/**
 * 判断该请求地址是不是符合 fastest 转发规则。
 *
 * 例如：
 * http://fastest2.now.qq.com/_fst_/11_url_cn/_fst_/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152
 *
 * @param {String} requestUrl 请求的地址
 * @param {String} pattern 要验证的配置项，例如 11.url.cn 或者 now.qq.com/cgi-bin
 * @return {Boolean}
 */
function isMatchVProxy(requestUrl, pattern) {
    return !!requestUrl.match(new RegExp(`${MATCH_PROXY_TAG}/${fastestUtil.replaceDotToUnderline(pattern)}/${MATCH_PROXY_TAG}/`));
}

/**
 * 将包含了 fastest _fst_ 标记的url替换为原始的请求地址
 *
 * @param {String} requestUrl 请求的地址，例如 /xxx/xyz.js
 * @param {String} pattern 要验证的配置项，例如 11.url.cn 或者 now.qq.com/cgi-bin
 * @return {String}
 */
function removeVProxy(requestUrl, pattern) {
    return requestUrl.replace(new RegExp(`${MATCH_PROXY_TAG}/${fastestUtil.replaceDotToUnderline(pattern)}/${MATCH_PROXY_TAG}/`, 'gi'), '');
}

/**
 * 将原始的请求地址进行部分替换，根据规则匹配项，加上 fastest _fst_ 标记
 *
 * @param {String} content 内容
 * @param {String} pattern 要验证的配置项，例如 11.url.cn 或者 now.qq.com/cgi-bin
 * @param {String} proxyDomain 测试域名，例如 fastest2.now.qq.com
 * @return {String}
 */
function addVProxyForContent(content, pattern, proxyDomain) {
    const newContent = content.replace(new RegExp(pattern, 'gi'), `${proxyDomain}/${MATCH_PROXY_TAG}/${fastestUtil.replaceDotToUnderline(pattern)}/${MATCH_PROXY_TAG}`);

    // 发现一旦重复替换了，则放弃
    if (new RegExp(`${MATCH_PROXY_TAG}/${MATCH_PROXY_TAG}`, 'gi').test(newContent)) {
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
function addAllVProxyForContent(content, rules, proxyDomain) {
    // 1. 获取 html 文件内容
    let newContent = content;

    // 2. 根据规则，依次进行转发替换，将匹配的请求转发到 fastest 上
    for (let i = 0; i < rules.length; i++) {
        let rule = rules[i];

        newContent = addVProxyForContent(newContent, rule.pattern, proxyDomain);
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
    MATCH_PROXY_TAG,
    isMatchVProxy,
    removeVProxy,
    addVProxyForContent: addVProxyForContent,
    addAllVProxyForContent: addAllVProxyForContent,
    removeIntegrityForHtml
};
