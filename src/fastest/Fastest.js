class ProxyRequestOpts {
    constructor(host, url) {
        this.host = host;
        this.url = url;
        this.fullUrl = this._getFullUrl();
    }

    update(data = {}) {
        this.host = data.host || this.host;
        this.url = data.url || this.url;
        this.fullUrl = this._getFullUrl();
    }

    _getFullUrl() {
        return `http://${this.host}${this.url}`;
    }
}

class Fastest {
    constructor(proxyEnv, ctx) {
        this.proxyEnv = proxyEnv;
        this.ctx = ctx;
    }

    /**
     * 处理本次请求，分析并获取请求转发的参数
     * @return {Promise<any>}
     */
    proxyRequest() {
        return new Promise((resolve, reject) => {
            const requestUrl = this.ctx.request.url;
            const { originDomain, rules } = this.proxyEnv;

            // 请求转发参数
            let proxyRequestOpts = new ProxyRequestOpts(originDomain, requestUrl);

            // TODO 如果支持用户自定义输入，则这里可能需要限制下书写规范，或者看看 whistle 是怎么识别哪些是 pattern
            for (let i = 0; i < rules.length; i++) {
                let rule = rules[i];

                // 如果当前的请求链接是追加了 host 的场景，则需要将 host 信息解析出来
                if (rule.isProxyTypeOfHost(proxyRequestOpts.url)) {
                    proxyRequestOpts.update(rule.getProxyTypeOfHostResult(proxyRequestOpts.url));
                    break;
                }

                // TODO 要考虑请求转发的场景
            }

            // 重要 fullUrl 一定要修改，因为后续 whistle 在调用 urlParse 方法时是拿这个值处理的
            this.ctx.fullUrl = proxyRequestOpts.fullUrl;

            resolve(proxyRequestOpts);
        });
    }

    getRewriteHtml(htmlContent, opts = {}) {
        return new Promise((resolve, reject) => {
            const { testDomain, rulesFromCustom } = opts;

            // 通过 id 查询到配置
            // const fastestConfig = {
            //     id: 1,
            //     originDomain: 'now.qq.com',
            //     testDomain: 'fastest2.now.qq.com',
            //     rulesFromFastest: [''],
            //     rulesFromCustom: [
            //         'now.qq.com 10.100.64.201', // 用户自己配置
            //         'now.qq.com/cgi-bin 10.100.64.201', // 用户自己配置
            //         '11.url.cn 10.100.64.201', // 用户自己配置，且与主域一致
            //         '88.url.cn 10.100.64.136' // 用户自己配置，且与主域不一致，fastest不改动
            //     ]
            // };

            // html 文件内容
            let newHtmlContent = htmlContent;

            //------------begin 修改 html 文件的内容--------------
            // 示例：替换静态资源
            // newHtmlContent = newHtmlContent.replace(/11\.url\.cn/gi, 'fastest2.now.qq.com/rewrite/11_url_cn');

            // 如果支持用户自定义输入，则这里可能需要限制下书写规范，或者看看 whistle 是怎么识别哪些是 pattern
            // 我们假设限制都是只支持 host 方式的配置
            rulesFromCustom.forEach((rule) => {
                const ruleInfo = fastestUtil.parseWhistleRule(rule);

                // 是否为修改host场景
                const isTypeHost = fastestUtil.isIP(ruleInfo.operatorURI);

                console.log('------', rule, isTypeHost, ruleInfo);

                // 如果是修改 host 场景
                if (isTypeHost) {
                    newHtmlContent = addVHost(newHtmlContent, ruleInfo.pattern, testDomain);
                }

                // TODO 还需要考虑配置转发的场景

            });

            // 去掉 script 标签上的 integrity 属性，不然会被安全策略阻挡，因为我们的确修改了 html 内容
            newHtmlContent = newHtmlContent.replace(/\s+integrity="[^"]*"/gi, '');

            //------------end 修改 html 文件的内容---------------

            resolve({
                body: newHtmlContent,
                header: {
                    'x-test': 'abcd'
                }
            });
        });
    }
}

module.exports = Fastest;