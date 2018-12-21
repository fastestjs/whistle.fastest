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