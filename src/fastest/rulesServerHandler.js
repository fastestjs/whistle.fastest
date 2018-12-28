const ProxyEnv = require('./ProxyEnv');
const fastestUtil = require('./fastest-util');
const db = require('../fastest-server/db');

function getRequestParams(ctx) {
    // 获得代理环境ID
    let proxyEnvId = ctx.query['_fst_idx'] || ctx.cookies.get('_fst_idx') || fastestUtil.getParamFromURL('_fst_idx', ctx.request.headers.referer) || 27;

    // 代理环境的域名
    let proxyDomain = ctx.req.headers.host;

    // 代理环境的域名
    const uin = fastestUtil.getUin(ctx.cookies.get('uin'));

    return {
        proxyEnvId,
        proxyDomain,
        uin
    };
}

exports.handleRequestRules = async (ctx) => {
    // https://github.com/whistle-plugins/whistle.script#%E8%AE%BE%E7%BD%AE%E8%A7%84%E5%88%99
    console.log('handleRequestRules start', ctx.fullUrl);

    // 获取请求参数
    const requestParams = getRequestParams(ctx);
    console.log('handleRequestRules requestParams', requestParams);

    // 请求配置管理页的数据
    const fastestEnvData = db.getRemoteConfig(requestParams.proxyEnvId, requestParams.proxyDomain, { uin: requestParams.uin });

    // 获得当前的 fastest 配置参数
    const proxyEnv = new ProxyEnv(fastestEnvData);

    // 完整的规则
    ctx.rules = [
        `/^https?://${proxyEnv.proxyDomain}/(.*\.(js|html|css|png|jpg|gif|jpeg|svg|blob|ttf|woff|woff2|mp4).*)$/ fastest://`,
        `${proxyEnv.proxyDomain} ${proxyEnv.originDomain}`,
        ...proxyEnv.formatRules()
    ];

    // 将配置参数传递下去，后续流程需要用到这些配置
    ctx.options.proxyEnv = proxyEnv;

    console.log('handleRequestRules end');
};