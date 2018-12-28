const _ = require('./util');

const RULE_TYPE_STATIC = 1;
const RULE_TYPE_CGI = 2;

/**
 * 从远程拉取代理环境信息
 *
 * @param {Number} proxyEnvId 代理环境ID
 * @param {String} proxyDomain 代理环境的域名
 * @param {Object} [opts] 额外参数
 * @param {Number} [opts.uin] uin值
 * @return {Promise<void>}
 */
exports.getRemoteConfig = async function (proxyEnvId, proxyDomain, opts = {}) {
    console.log('开始获取远程配置');

    // 原始环境的域名
    let originDomain = proxyDomain.replace(/fastest\./, '');

    // 远程请求获取配置信息
    let remoteConfigData = require('../../tmp/data');

    // 所有代理环境列表
    let allProxyEnvList = remoteConfigData.data || [];

    // 获得用户 uin，以便做白名单控制
    if (opts.uin) {
        allProxyEnvList = _.filterListByUin(allProxyEnvList, opts.uin);
    }

    // 根据 id 从列表中找出对于的数据
    let data = _.getConfById(allProxyEnvList, proxyEnvId);

    // CGI
    let cgiRules = _.getSubArrByType(data.rules, RULE_TYPE_CGI);

    // 静态资源
    let staticRules = _.getSubArrByType(data.rules, RULE_TYPE_STATIC);

    let ruleConfig = {};

    ruleConfig.staticRules = staticRules;
    ruleConfig.cgiRules = cgiRules;
    ruleConfig.productDomain = originDomain;
    ruleConfig.rules = data.rules || [];
    ruleConfig.envConfList = allProxyEnvList;

    return ruleConfig;
};
