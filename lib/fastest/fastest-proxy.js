'use strict';

var fastestUtil = require('./fastest-util');

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
    return !!requestUrl.match(new RegExp('vhost/' + fastestUtil.replaceDotToUnderline(pattern) + '/vhost/'));
}

/**
 * 将包含了 fastest vhost 标记的url替换为原始的请求地址
 *
 * @param {String} requestUrl 请求的地址
 * @param {String} pattern 要验证的配置项，例如 11.url.cn 或者 now.qq.com/cgi-bin
 * @return {String}
 */
function removeVHost(requestUrl, pattern) {
    return requestUrl.replace(new RegExp('vhost/' + fastestUtil.replaceDotToUnderline(pattern) + '/vhost/', 'gi'), '');
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
    return content.replace(new RegExp(pattern, 'gi'), testDomain + '/vhost/' + fastestUtil.replaceDotToUnderline(pattern) + '/vhost');
}

module.exports = {
    isMatchVHost: isMatchVHost,
    removeVHost: removeVHost,
    addVHost: addVHost
};