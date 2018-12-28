const CONFIG = require('../config');

/**
 * 替换响应体里面的域名
 * @param {String} body
 * @param {Array} domains
 */
let replaceProductDomains = (body, domains, proxyDomain) => {
    domains.forEach((domain) => {
        body = body.replace(new RegExp(`${domain}`, 'g'), proxyDomain);
    });
    return body;
};

/**
 * 替换响应中的静态资源域名
 * @param {String} body
 * @param {Array} domains
 */
let replaceStaticDomains = (body, domains, proxyDomain) => {
    domains.forEach((item, idx) => {
        body = body.replace(new RegExp(`${item}`, 'g'), `${proxyDomain}/${item.split('.').join('_')}`);
    });
    return body;
};

/**
 * 从数据中获取指定key值组成新数组
 * @param {String} key
 * @param {Array} arr
 */
let getKeysFromArray = (key, arr = []) => {
    let ret = [];

    arr.forEach((item, idx) => {
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
let getStaticDomain = (path, domains, fullURL) => {
    let ret = null;
    domains.forEach((item, idx) => {
        let reg = new RegExp(`${item.split('.').join('_')}`, 'g');
        if (reg.test(path)) {
            let itemArr = item.split('/') || [];

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
let matchRules = (path, domains) => {
    let ret = null;
    domains.forEach((item, idx) => {
        let reg = new RegExp(`${item}`, 'g');
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
let isMacthCgiRules = (path, rules) => {
    let ret = false;

    rules.forEach((rule) => {
        let reg = new RegExp(`${rule}`, 'g');
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
let isImage = (text) => {
    let imgTypes = CONFIG.imageHeaderTypes;
    let contentType = text;
    let ret = false;

    imgTypes.forEach((item, idx) => {
        let reg = new RegExp(`${item}`, 'g');
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
let isHTML = (res) => {
    let contentType = res.headers['content-type'];
    let ret = false;
    let reg = new RegExp(`text/html`, 'g');
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
let injectScript = (body, conf, useEruda) => {
    let injectFileString = '<script>;window._fastest_conf_=' + JSON.stringify(conf) + ';</script>' +
        '<script type="text/javascript" crossorigin="anonymous" src="//11.url.cn/fastest/fastest.js"></script>';

    if (useEruda == '1') {
        let injectBeforeHeadScript = '<script type="text/javascript" crossorigin="anonymous" src="//pub.idqqimg.com/b31bf2983bb14c7b809c81c53a487f47.js"></script>' +
            '<script>eruda.init();eruda.get(\'console\').config.set(\'catchGlobalErr\', false);</script>';

        body = body.replace(/<head>([\s\S]*?)<\/head>/i, '<head>' + injectBeforeHeadScript + '$1</head>');
    }

    // body = body.split('</body>')[0] + injectFileString + '</body></html>';
    body = body + `${injectFileString}`;
    return body;
};

/**
 *
 * @param {Array} list
 */
let generateFastestConfByAuthor = (list) => {
    let ret = [];

    list.forEach((item) => {
        ret.push({
            mcName: `${item.name} --by ${item.author}`,
            id: item.id
        });
    });

    return ret;
};

let getSubArrByType = (arr = [], type) => {
    let ret = [];

    arr.forEach(item => {
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
let replaceHTMLDomains = (body, domains, proxyDomain, productDomain) => {
    domains.forEach((item, idx) => {
        let productDomainReg = new RegExp(`${productDomain}`, 'g');
        let replacePathReg = new RegExp(`${proxyDomain}/${item.split('.').join('_')}`, 'g');
        console.log('replaceHTMLDomains: ', item, replacePathReg);
        if (!productDomainReg.test(item) && !replacePathReg.test(body)) {
            body = body.replace(new RegExp(`${item}`, 'g'), `${proxyDomain}/${item.split('.').join('_')}`);
        }
    });
    return body;
};

/*
     *  从URL中获取参数对应的值
     */
let getUrlParam = (name, url) => {
    //参数：变量名，url为空则直接返回
    if (!url) {
        return '';
    }
    var u = url,
        reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'),
        r = u.substr(u.indexOf('\?') + 1).match(reg);
    return r != null ? r[2] : '';
};

let filterListByUin = function (list, uin) {
    let ret = [];
    list.forEach(item => {
        let relateQQ = item.relate_qq;
        if (relateQQ) {
            if (new RegExp(`${uin}`, 'g').test(relateQQ)) {
                ret.push(item);
            }
        } else {
            ret.push(item);
        }
    });

    return ret;
};

let getConfById = function (list, id) {
    let ret = {};
    list.forEach(item => {
        if (item.id == id) {
            ret = item;
        }
    });
    return ret;
};

module.exports = {
    replaceProductDomains,
    getKeysFromArray,
    replaceStaticDomains,
    getStaticDomain,
    isImage,
    isMacthCgiRules,
    isHTML,
    injectScript,
    getSubArrByType,
    matchRules,
    replaceHTMLDomains,
    generateFastestConfByAuthor,
    getUrlParam,
    filterListByUin,
    getConfById
};