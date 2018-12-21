const ProxyEnv = require('./ProxyEnv');

class FastestConfig {
    constructor(data = {}) {
        /**
         * 配置环境的ID，可通过这个ID来快速选择到这个测试环境
         */
        this.id = data.id;

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
         * 可选的代理环境的列表
         */
        this.proxyEnvList = this._getProxyEnvList(data.proxy_env);
    }

    _getProxyEnvList(proxyEnvList = []) {
        return proxyEnvList.map((proxyEnv) => {
            return new ProxyEnv(proxyEnv);
        });
    }
}

module.exports = FastestConfig;