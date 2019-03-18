const ProxyRule = require('./ProxyRule');

class ProxyEnvItem {
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
         * 是否启用白名单
         * @type {Number}
         */
        this.status = data.status;

        /**
         * 状态
         * 0=正常
         * 1=被禁用
         * 2=无权使用
         * @type {Number}
         */
        this.proxyStatus = data.proxyStatus || 2;

        /**
         * 代理规则列表
         * 注意：只有 status=0 时才返回
         * @type {ProxyRule[]}
         */
        this.rules = this._getRules(data.rules);
    }

    setProxyStatus(proxyStatus) {
        this.proxyStatus = proxyStatus;
    }

    /**
     * 是否可以正常使用代理
     * @return {Boolean}
     */
    isAvailable() {
        return this.proxyStatus === 0;
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

class ProxyEnv {
    constructor(data = {}) {
        /**
         * 正式环境的原始域名
         * 注意：只有 status=0 时才返回
         * @type {String}
         */
        this.originDomain = data.originDomain;

        /**
         * 测试环境的代理域名
         * 注意：只有 status=0 时才返回
         * @type {String}
         */
        this.proxyDomain = data.proxyDomain;

        /**
         * 本地的 whistle 服务地址，例如 http://127.0.0.1:8080，用于代理转发时设置的代理服务地址
         * 注意：只有 status=0 时才返回
         * @type {String}
         */
        this.whistleServer = data.whistleServer;

        /**
         * 该用户拥有的所有的环境列表
         * @type {ProxyEnvItem[]}
         */
        this.myList = this._getMyList(data.myList);

        /**
         * 当前环境
         * @type {ProxyEnvItem}
         */
        this.target = this.myList.filter((item) => {
            return item.id === data.target.id;
        })[0] || new ProxyEnvItem({ id: data.target.id });

        // 更新环境可使用状态
        this.target.setProxyStatus(data.target.proxystatus);
    }

    _getMyList(list = []) {
        return list.map((item) => {
            return new ProxyEnvItem(item);
        });
    }
}

module.exports = ProxyEnv;