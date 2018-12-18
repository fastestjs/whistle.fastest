const Koa = require('koa');
const _ = require('./util');

// 模拟请求了 fastest.oa.com 中配置的数据
let remoteFastestConfig = require('../mock/data1');

module.exports = (server, opts) => {
    const app = new Koa();

    app.use(async (ctx, next) => {
        // 获得 fastest 配置项 ID
        // let confIndex = ctx.query['_fst_idx'] || ctx.cookies.get('_fst_idx') || getUrlParam('_fst_idx', ctx.request.headers.referer) || 27;
        let fastestConfigId = 27;

        // 环境列表
        let envList = [];
        if (remoteFastestConfig.retcode === 0) {
            envList = remoteFastestConfig.data;
        }

        // 获得当前的 fastest 配置项
        let currentConfig = _.getConfById(envList, fastestConfigId);

        // 获得用户配置的规则
        let customRules = _.formatRules(currentConfig.rules);

        // 完整的规则
        let rules = [
            `/^https?://fastest.${currentConfig.product_domain}/(.*\.(js|html|css|png|jpg|gif|jpeg|svg|blob|ttf|woff|woff2|mp3).*)$/ fastest://handle_response`,
            `fastest.${currentConfig.product_domain} ${currentConfig.product_domain}`,
            ...customRules
        ];

        // ？
        ctx.body = {
            rules: rules.join('\n')
        };

        // 将配置参数传递下去，后续流程需要用到这些配置
        // ctx.options.fastestConfig = fastestConfig;

        await next();
    });

    server.on('request', app.callback());
    // console.log('whistle.script rulesServer start: ', envList);
};