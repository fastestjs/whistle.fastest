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
     * @type {String}
     */
    this.originDomain = data.origin_domain;

    /**
     * 测试环境的代理域名
     * @type {String}
     */
    this.proxyDomain = data.proxy_domain;

    /**
     * 本地的 whistle 服务地址，例如 http://127.0.0.1:8080，用于代理转发时设置的代理服务地址
     * @type {String}
     */
    this.whistleServer = data.whistle_server;

    /**
     * 是否被禁用
     * @type {Boolean}
     */
    this.isDisable = !!data.status || false;

    /**
     * 代理规则列表
     * @type {ProxyRule[]}
     */
    this.rules = this._getRules(data.rules);
  }

  /**
   * 获得 whistle 规则
   * 例如：['now.qq.com 10.100.11.11','11.url.cn 10.100.11.11']
   * @return {String[]}
   */


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