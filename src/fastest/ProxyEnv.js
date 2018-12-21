const ProxyRule = require('./ProxyRule');

class ProxyEnv {
    constructor(data = {}) {
        /**
         * 配置环境的ID，可通过这个ID来快速选择到这个测试环境
         */
        this.id = data.id;

        /**
         * 配置环境的别称，用于在选择时进行识别
         */
        this.name = data.name || '';

        /**
         * 正式环境的原始域名
         */
        this.originDomain = data.origin_domain;

        /**
         * 测试环境的代理域名
         * @type {string}
         */
        this.proxyDomain = data.proxy_domain;

        /**
         * 本地的 whistle 服务地址，例如 http://127.0.0.1:8080
         * @type {string}
         */
        this.whistleServer = data.whistle_server;

        /**
         * 是否被禁用
         * @type {Boolean}
         */
        this.isDisable = !!data.status || false;

        /**
         * 代理规则列表
         */
        this.rules = this._getRules(data.rules);
    }

    _getRules(ruleList = []) {
        return ruleList.map((rule) => {
            return new ProxyRule(rule);
        });
    }
}

module.exports = ProxyEnv;