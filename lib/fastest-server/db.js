'use strict';

var ProxyEnv = require('../fastest/ProxyEnv');

/**
 * 从远程拉取代理环境信息，获取该id对应的环境配置和该用户有权使用的列表
 *
 * 1. 过滤出当前的请求的环境配置，如果有权限，则使用之
 * 2. 拉取该用户拥有的其他环境列表，以便在前端页面可以自由切换环境
 *
 * @param {Number} proxyEnvId 代理环境ID
 * @param {Object} [opts] 额外参数
 */
exports.getRemoteConfig = function (proxyEnvId) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    console.log('开始获取远程配置');

    // 远程请求获取配置信息
    var remoteData = require('../../tmp/fastest3data').result;

    var ruleConfig = {
        originDomain: remoteData.origin_domain,
        proxyDomain: remoteData.proxy_domain,
        whistleServer: remoteData.whistle_server || 'http://127.0.0.1:8080',
        target: remoteData.target,
        myList: remoteData.mylist
    };

    // 获得当前的 fastest 配置参数
    var proxyEnv = new ProxyEnv(ruleConfig);

    console.log('[db.js] proxyEnv', proxyEnv);

    return proxyEnv;
};