'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProxyRule = require('./ProxyRule');

var ProxyEnv = function () {
  function ProxyEnv() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, ProxyEnv);

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

  (0, _createClass3.default)(ProxyEnv, [{
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
  return ProxyEnv;
}();

module.exports = ProxyEnv;