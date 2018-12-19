function repaceDotToUnderline(str) {
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
function isReriteByHost(requestUrl, pattern) {
    return !!requestUrl.match(new RegExp(`vhost/${pattern.replace(/\./gi, '_')}/vhost/`));
}

module.exports = {
    repaceDotToUnderline,
    isReriteByHost

};
//
// console.log(isReriteByHost('http://fastest2.now.qq.com/vhost/11_url_cn/vhost/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152', '11_url_cn'));
