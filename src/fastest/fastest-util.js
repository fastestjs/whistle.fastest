/**
 * 判断是否为 IP 地址
 *
 * @param {String} str 字符串
 * @return {Boolean}
 */
function isIP(str) {
    const regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

    return !!regIP.test(str);
}

/**
 * 解析 whistle 中的规则
 * @param {String} rule 规则
 * @return {Object}
 */
function parseWhistleRule(rule = '') {
    const arr = rule.trim().split(/\s+/);

    // TODO 这种解析方式可能存在问题，需要去查阅下 whistle 本身是怎么解析的
    return {
        pattern: arr[0],
        operatorURI: arr[1]
    };
}

/**
 * 根据 content-type 来判断是否HTML响应
 *
 *   text/html; charset=utf-8
 *
 * @param {String} contentType
 */
function isHTML(contentType = '') {
    return new RegExp('text/html', 'gi').test(contentType);
}

/**
 * 根据 content-type 来判断是否是 js 文件
 *
 *   application/x-javascript
 *   application/javascript; chareset=utf-8
 *   text/javascript; chareset=UTF-8
 *
 * @param {String} contentType
 */
function isJavaScript(contentType = '') {
    return new RegExp('javascript', 'gi').test(contentType);
}

/**
 * 根据 content-type 来判断是否是 css 文件
 *
 *   text/css
 *   text/css; chareset=utf-8
 *
 * @param {String} contentType
 */
function isCss(contentType = '') {
    return new RegExp('text/css', 'gi').test(contentType);
}

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
 * 从 HTML 中去掉 script 标签上的 integrity 属性，不然会被安全策略阻挡，因为我们的确修改了 html 内容
 *
 * @param {String} htmlContent
 * @return {String}
 */
function removeIntegrityForHtml(htmlContent) {
    return htmlContent.replace(/\s+integrity="[^"]*"/gi, '');
}

/**
 * 从URL中获取参数对应的值
 *
 * @param {String} name 参数名
 * @param {String} url
 * @return {String}
 */
function getParamFromURL(name, url) {
    //参数：变量名，url为空则直接返回
    if (!name || !url) {
        return '';
    }

    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = url.substr(url.indexOf('\?') + 1).match(reg);

    return r != null ? r[2] : '';
}

/**
 * 获取 uin
 *
 * @param {String} uinFromCookie cookie里面的 uin 值，可能为: o123456
 * @return {Number}
 */
function getUin(uinFromCookie) {
    return uinFromCookie && parseInt(uinFromCookie.replace(/\D/g, ''), 10) || 0;
}

module.exports = {
    isIP,
    parseWhistleRule,
    isHTML,
    isJavaScript,
    isCss,
    replaceDotToUnderline,
    removeIntegrityForHtml,
    getParamFromURL,
    getUin
};
