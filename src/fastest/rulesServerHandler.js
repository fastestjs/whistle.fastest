const ProxyEnv = require('./ProxyEnv');

exports.handleRequestRules = async (ctx) => {
    // https://github.com/whistle-plugins/whistle.script#%E8%AE%BE%E7%BD%AE%E8%A7%84%E5%88%99
    console.log('handleRequestRules start', ctx.fullUrl);

    // 模拟请求了配置管理页的数据
    const fastestEnvData = require('../../mock/data1');

    // 获得当前的 fastest 配置参数
    const proxyEnv = new ProxyEnv(fastestEnvData.result);

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