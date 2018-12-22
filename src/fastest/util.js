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
 * @param {String} contentType
 */
function isHTML(contentType = '') {
    return new RegExp('text/html', 'gi').test(contentType);
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

module.exports = {
    isIP,
    parseWhistleRule,
    isHTML,
    replaceDotToUnderline
};
