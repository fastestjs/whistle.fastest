'use strict';

/**
 * 判断是否为 IP 地址
 *
 * @param {String} str 字符串
 * @return {Boolean}
 */
function isIP(str) {
    var regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

    return !!regIP.test(str);
}

/**
 * 解析 whistle 中的规则
 * @param {String} rule 规则
 * @return {Object}
 */
function parseWhistleRule(rule) {
    var arr = rule.trim().split(/\s+/);

    // TODO 这种解析方式可能存在问题，需要去查阅下 whistle 本身是怎么解析的
    return {
        pattern: arr[0],
        operatorURI: arr[1]
    };
}

// /**
//  * 判断响应头是否图片请求
//  * @param {Object} res
//  */
// let isImage = (text) => {
//     let imgTypes = CONFIG.imageHeaderTypes;
//     let contentType = text;
//     let ret = false;
//
//     imgTypes.forEach((item, idx) => {
//         let reg = new RegExp(`${item}`, 'g');
//         if(reg.test(contentType)) {
//             ret = true;
//         }
//     });
//
//     return ret;
// }

/**
 * 根据 content-type 来判断是否HTML响应
 * @param {String} contentType
 */
function isHTML() {
    var contentType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return new RegExp('text/html', 'gi').test(contentType);
}

module.exports = {
    isIP: isIP,
    parseWhistleRule: parseWhistleRule,
    isHTML: isHTML
};