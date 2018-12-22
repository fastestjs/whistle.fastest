const fastestProxy = require('./fastest-proxy');

/**
 * 规则类型
 * @type {Object}
 */
const TYPE = {
    /**
     * 静态资源
     */
    STATIC: 1,

    /**
     * CGI 资源
     */
    CGI: 2
};

/**
 * 代理类型
 * @type {Object}
 */
const PROXY_TYPE = {
    /**
     * 设置 host
     */
    HOST: 1,

    /**
     * 转发
     */
    FORWARD: 2
};

/**
 * 默认是将匹配模式写在左边，操作uri写在右边: pattern operatorURI
 */
class ProxyRule {
    constructor(data) {
        /**
         * whistle的匹配模式(pattern)
         *
         * 大体可以分成：域名、路径、正则、精确匹配、通配符匹配
         * https://wproxy.org/whistle/pattern.html
         *
         * @type {String}
         */
        this.pattern = data.rule;

        /**
         * 操作，例如 host 或者 代理地址等
         * @type {String}
         */
        this.operatorURI = data.host;

        /**
         * 代理类型
         * @type {Object}
         */
        this.proxyType = data.proxy_type;

        /**
         * 规则类型
         * @type {Object}
         */
        this.type = data.type;

        /**
         * 是否被禁用
         * @type {Boolean}
         */
        this.isDisable = !!data.status || false;
    }

    matchProxyTypeOfHost(url) {
        return fastestProxy.isMatchVHost(url, this.pattern);
    }

    getProxyTypeOfHostResult(url) {
        return {
            // 注意 pattern 不一定是域名，可能包含路径，而 host 只需要域名即可
            host: this.pattern.split('/')[0],
            url: fastestProxy.removeVHost(url, this.pattern)
        };
    }

    isProxyTypeOfHost() {
        return this.proxyType === PROXY_TYPE.HOST;
    }
}

ProxyRule.PROXY_TYPE = PROXY_TYPE;

module.exports = ProxyRule;
