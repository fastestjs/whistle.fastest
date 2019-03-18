const ProxyRule = require('./ProxyRule');

class ProxyEnv {
    constructor(data = {}) {
        /**
         * 配置环境的ID，可通过这个ID来快速选择到这个测试环境
         * @type {Number}
         */
        this.id = data.id;

        /**
         * 配置环境的别称，一般建议中文名，用于在选择环境时进行识别
         * @type {String}
         */
        this.name = data.name || '';

        /**
         * 正式环境的原始域名
         * 注意：只有 status=0 时才返回
         * @type {String}
         */
        this.originDomain = data.origin_domain;

        /**
         * 测试环境的代理域名
         * 注意：只有 status=0 时才返回
         * @type {String}
         */
        this.proxyDomain = data.proxy_domain;

        /**
         * 本地的 whistle 服务地址，例如 http://127.0.0.1:8080，用于代理转发时设置的代理服务地址
         * 注意：只有 status=0 时才返回
         * @type {String}
         */
        this.whistleServer = data.whistle_server;

        /**
         * 状态
         * 0=正常
         * 1=被禁用
         * 2=无权使用
         * @type {Boolean}
         */
        this.status = data.status;

        /**
         * 代理规则列表
         * 注意：只有 status=0 时才返回
         * @type {ProxyRule[]}
         */
        this.rules = this._getRules(data.rules);
    }

    /**
     * 获得 whistle 规则
     * 例如：['now.qq.com 10.100.11.11','11.url.cn 10.100.11.11']
     * @return {String[]}
     */
    formatRules() {
        return this.rules.map(rule => {
            return `${rule.pattern} ${rule.operatorURI}`;
        });
    }

    _getRules(ruleList = []) {
        return ruleList.map((rule) => {
            return new ProxyRule(rule);
        });
    }
}

module.exports = ProxyEnv;