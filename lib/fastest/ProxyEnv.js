'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProxyRule = require('./ProxyRule');

var ProxyEnvItem = function () {
    function ProxyEnvItem() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, ProxyEnvItem);

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

    (0, _createClass3.default)(ProxyEnvItem, [{
        key: 'setProxyStatus',
        value: function setProxyStatus(proxyStatus) {
            this.proxyStatus = proxyStatus;
        }

        /**
         * 是否可以正常使用代理
         * @return {Boolean}
         */

    }, {
        key: 'isAvailable',
        value: function isAvailable() {
            return this.proxyStatus === 0;
        }

        /**
         * 获得 whistle 规则
         * 例如：['now.qq.com 10.100.11.11','11.url.cn 10.100.11.11']
         * @return {String[]}
         */

    }, {
        key: 'formatRules',
        value: function formatRules() {
            return this.rules.map(function (rule) {
                return rule.pattern + ' ' + rule.operatorURI;
            });
        }
    }, {
        key: '_getRules',
        value: function _getRules() {
            var ruleList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            return ruleList.map(function (rule) {
                return new ProxyRule(rule);
            });
        }
    }]);
    return ProxyEnvItem;
}();

var ProxyEnv = function () {
    function ProxyEnv() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        (0, _classCallCheck3.default)(this, ProxyEnv);

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
        this.target = this.myList.filter(function (item) {
            return item.id === data.target.id;
        })[0] || new ProxyEnvItem({ id: data.target.id });

        // 更新环境可使用状态
        this.target.setProxyStatus(data.target.proxystatus);
    }

    (0, _createClass3.default)(ProxyEnv, [{
        key: '_getMyList',
        value: function _getMyList() {
            var list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            return list.map(function (item) {
                return new ProxyEnvItem(item);
            });
        }
    }]);
    return ProxyEnv;
}();

module.exports = ProxyEnv;