'use strict';

var _ = require('./util');

var RULE_TYPE_STATIC = 1;
var RULE_TYPE_CGI = 2;

/**
 * 从远程拉取代理环境信息
 *
 * @param {Number} proxyEnvId 代理环境ID
 * @param {String} proxyDomain 代理环境的域名
 * @param {Object} [opts] 额外参数
 * @param {Number} [opts.uin] uin值
 */
exports.getRemoteConfig = function (proxyEnvId, proxyDomain) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    console.log('开始获取远程配置');

    // 原始环境的域名
    var originDomain = proxyDomain.replace(/fastest\./, '');

    // 远程请求获取配置信息
    var remoteConfigData = require('../../tmp/data');

    // 所有代理环境列表
    var allProxyEnvList = remoteConfigData.data || [];

    // 获得用户 uin，以便做白名单控制
    if (opts.uin) {
        allProxyEnvList = _.filterListByUin(allProxyEnvList, opts.uin);
    }

    // 根据 id 从列表中找出对于的数据
    var data = _.getConfById(allProxyEnvList, proxyEnvId);

    // 代理规则
    var rules = data.rules.map(function (item) {
        return {
            type: item.type,
            proxy_type: 1,
            rule: item.rule,
            host: item.host,
            status: 1
        };
    });

    var ruleConfig = {
        id: data.id,
        name: data.name,
        origin_domain: data.product_domain,
        proxy_domain: proxyDomain,
        whistle_server: 'http://127.0.0.1:8080',
        status: 1,
        rules: rules
    };

    // ruleConfig.envConfList = allProxyEnvList;

    return ruleConfig;
};

// console.log(exports.getRemoteConfig(27, 'fastest.now.qq.com'));