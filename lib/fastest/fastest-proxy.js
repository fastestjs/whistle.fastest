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
function replaceFastestVHost(requestUrl, pattern) {
    return requestUrl.replace(new RegExp(`vhost/${replaceDotToUnderline(pattern)}/vhost/`, 'gi'), '');
}

module.exports = {
    replaceDotToUnderline,
    isMatchVHost,
    replaceFastestVHost
};
