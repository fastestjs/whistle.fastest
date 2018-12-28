'use strict';

var CONFIG = require('./config');

/**
 * 替换响应体里面的域名
 * @param {String} body
 * @param {Array} domains
 */
var replaceProductDomains = function replaceProductDomains(body, domains, proxyDomain) {
    domains.forEach(function (domain) {
        body = body.replace(new RegExp('' + domain, 'g'), proxyDomain);
    });
    return body;
};

/**
 * 替换响应中的静态资源域名
 * @param {String} body
 * @param {Array} domains
 */
var replaceStaticDomains = function replaceStaticDomains(body, domains, proxyDomain) {
    domains.forEach(function (item, idx) {
        body = body.replace(new RegExp('' + item, 'g'), proxyDomain + '/' + item.split('.').join('_'));
    });
    return body;
};

/**
 * 从数据中获取指定key值组成新数组
 * @param {String} key
 * @param {Array} arr
 */
var getKeysFromArray = function getKeysFromArray(key) {
    var arr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var ret = [];

    arr.forEach(function (item, idx) {
        if (item[key]) {
            ret.push(item[key]);
        }
    });

    return ret;
};

/**
 * 从前端请求中获取真实的cdn域名，如fastest.now.qq.com/11_url_cn/xxx
 * @param {String} path
 * @param {Array} domains
 */
var getStaticDomain = function getStaticDomain(path, domains, fullURL) {
    var ret = null;
    domains.forEach(function (item, idx) {
        var reg = new RegExp('' + item.split('.').join('_'), 'g');
        if (reg.test(path)) {
            var itemArr = item.split('/') || [];

            if (itemArr[1]) {
                path = path.replace(new RegExp(itemArr[0], 'g'), '');
            } else {
                path = path.replace(reg, '');
            }
            ret = {
                rule: item,
                domain: itemArr[0],
                path: path,
                idx: idx
            };
        }
    });
    return ret;
};

/**
 * 从前端请求中获取真实的cdn域名，如fastest.now.qq.com/11_url_cn/xxx
 * @param {String} path
 * @param {Array} domains
 */
var matchRules = function matchRules(path, domains) {
    var ret = null;
    domains.forEach(function (item, idx) {
        var reg = new RegExp('' + item, 'g');
        if (reg.test(path)) {
            path = path.replace(reg, '');
            ret = {
                domain: item.split('/')[0],
                path: path,
                idx: idx
            };
        }
    });
    return ret;
};

/**
 * 是否命中cgi规则
 * @param {String} path
 * @param {Array} rules
 */
var isMacthCgiRules = function isMacthCgiRules(path, rules) {
    var ret = false;

    rules.forEach(function (rule) {
        var reg = new RegExp('' + rule, 'g');
        if (reg.test(path)) {
            ret = true;
        }
    });

    if (/cgi-bin/ig.test(path) || /graphql\//ig.test(path)) {
        ret = true;
    }

    return ret;
};

/**
 * 判断响应头是否图片请求
 * @param {Object} res
 */
var isImage = function isImage(text) {
    var imgTypes = CONFIG.imageHeaderTypes;
    var contentType = text;
    var ret = false;

    imgTypes.forEach(function (item, idx) {
        var reg = new RegExp('' + item, 'g');
        if (reg.test(contentType)) {
            ret = true;
        }
    });

    return ret;
};

/**
 * 判断是否HTML响应
 * @param {Object} res
 */
var isHTML = function isHTML(res) {
    var contentType = res.headers['content-type'];
    var ret = false;
    var reg = new RegExp('text/html', 'g');
    if (reg.test(contentType)) {
        ret = true;
    }

    return ret;
};

/**
 * 插入前端脚本
 * @param {String} body
 * @param {Object} conf
 */
var injectScript = function injectScript(body, conf, useEruda) {
    var injectFileString = '<script>;window._fastest_conf_=' + JSON.stringify(conf) + ';</script>' + '<script type="text/javascript" crossorigin="anonymous" src="//11.url.cn/fastest/fastest.js"></script>';

    if (useEruda == '1') {
        var injectBeforeHeadScript = '<script type="text/javascript" crossorigin="anonymous" src="//pub.idqqimg.com/b31bf2983bb14c7b809c81c53a487f47.js"></script>' + '<script>eruda.init();eruda.get(\'console\').config.set(\'catchGlobalErr\', false);</script>';

        body = body.replace(/<head>([\s\S]*?)<\/head>/i, '<head>' + injectBeforeHeadScript + '$1</head>');
    }

    // body = body.split('</body>')[0] + injectFileString + '</body></html>';
    body = body + ('' + injectFileString);
    return body;
};

/**
 *
 * @param {Array} list
 */
var generateFastestConfByAuthor = function generateFastestConfByAuthor(list) {
    var ret = [];

    list.forEach(function (item) {
        ret.push({
            mcName: item.name + ' --by ' + item.author,
            id: item.id
        });
    });

    return ret;
};

var getSubArrByType = function getSubArrByType() {
    var arr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var type = arguments[1];

    var ret = [];

    arr.forEach(function (item) {
        if (item.type === type) {
            ret.push(item);
        }
    });

    return ret;
};

/**
 * 替换响应中的静态资源域名
 * @param {String} body
 * @param {Array} domains
 */
var replaceHTMLDomains = function replaceHTMLDomains(body, domains, proxyDomain, productDomain) {
    domains.forEach(function (item, idx) {
        var productDomainReg = new RegExp('' + productDomain, 'g');
        var replacePathReg = new RegExp(proxyDomain + '/' + item.split('.').join('_'), 'g');
        console.log('replaceHTMLDomains: ', item, replacePathReg);
        if (!productDomainReg.test(item) && !replacePathReg.test(body)) {
            body = body.replace(new RegExp('' + item, 'g'), proxyDomain + '/' + item.split('.').join('_'));
        }
    });
    return body;
};

/*
     *  从URL中获取参数对应的值
     */
var getUrlParam = function getUrlParam(name, url) {
    //参数：变量名，url为空则直接返回
    if (!url) {
        return '';
    }
    var u = url,
        reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'),
        r = u.substr(u.indexOf('\?') + 1).match(reg);
    return r != null ? r[2] : '';
};

var filterListByUin = function filterListByUin(list, uin) {
    var ret = [];
    list.forEach(function (item) {
        var relateQQ = item.relate_qq;
        if (relateQQ) {
            if (new RegExp('' + uin, 'g').test(relateQQ)) {
                ret.push(item);
            }
        } else {
            ret.push(item);
        }
    });

    return ret;
};

var getConfById = function getConfById(list, id) {
    var ret = {};
    list.forEach(function (item) {
        if (item.id == id) {
            ret = item;
        }
    });
    return ret;
};

module.exports = {
    replaceProductDomains: replaceProductDomains,
    getKeysFromArray: getKeysFromArray,
    replaceStaticDomains: replaceStaticDomains,
    getStaticDomain: getStaticDomain,
    isImage: isImage,
    isMacthCgiRules: isMacthCgiRules,
    isHTML: isHTML,
    injectScript: injectScript,
    getSubArrByType: getSubArrByType,
    matchRules: matchRules,
    replaceHTMLDomains: replaceHTMLDomains,
    generateFastestConfByAuthor: generateFastestConfByAuthor,
    getUrlParam: getUrlParam,
    filterListByUin: filterListByUin,
    getConfById: getConfById
};