const fastestProxy = require('./fastest-proxy');

const { PROXY_TYPE } = require('./ProxyRule');

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

            // 从规则中寻找，如果本次请求链接中有符合转发标记的，则将其请求修改转发
            for (let i = 0; i < rules.length; i++) {
                let rule = rules[i];

                // 如果当前的请求链接是追加了 host 的场景，则需要将 host 信息解析出来
                if (rule.matchProxyTypeOfHost(proxyRequestOpts.url)) {
                    proxyRequestOpts.update(rule.getProxyTypeOfHostResult(proxyRequestOpts.url));
                    break;
                }

                // TODO 要考虑请求转发的场景
            }

            resolve(proxyRequestOpts);
        });
    }

    getRewriteHtml(htmlContent) {
        return new Promise((resolve, reject) => {
            const { proxyDomain, rules } = this.proxyEnv;

            // html 文件内容
            let newHtmlContent = htmlContent;

            // 根据规则，依次进行转发替换，将匹配的请求转发到 fastest 上
            for (let i = 0; i < rules.length; i++) {
                let rule = rules[i];

                switch (rule.proxyType) {
                    case PROXY_TYPE.HOST:
                        newHtmlContent = fastestProxy.addVHost(newHtmlContent, rule.pattern, proxyDomain);
                        break;
                    default:
                        break;
                }

                // TODO 要考虑请求转发的场景
            }

            // 去掉 script 标签上的 integrity 属性，不然会被安全策略阻挡，因为我们的确修改了 html 内容
            newHtmlContent = newHtmlContent.replace(/\s+integrity="[^"]*"/gi, '');

            //------------end 修改 html 文件的内容---------------

            resolve({
                body: newHtmlContent,
                header: {
                    'x-test': 'hello fastest'
                }
            });
        });
    }
}

module.exports = Fastest;