'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fastestProxy = require('./fastest-proxy');
var fastestUtil = require('./fastest-util');

var _require = require('./ProxyRule'),
    PROXY_TYPE = _require.PROXY_TYPE;

var ProxyRequestOpts = function () {
    function ProxyRequestOpts(host, url) {
        (0, _classCallCheck3.default)(this, ProxyRequestOpts);

        this.host = host;
        this.url = url;
        this.fullUrl = this._getFullUrl();
    }

    (0, _createClass3.default)(ProxyRequestOpts, [{
        key: 'update',
        value: function update() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this.host = data.host || this.host;
            this.url = data.url || this.url;
            this.fullUrl = this._getFullUrl();
        }
    }, {
        key: '_getFullUrl',
        value: function _getFullUrl() {
            return 'http://' + this.host + this.url;
        }
    }]);
    return ProxyRequestOpts;
}();

var Fastest = function () {
    function Fastest(proxyEnv, ctx) {
        (0, _classCallCheck3.default)(this, Fastest);

        this.proxyEnv = proxyEnv;
        this.ctx = ctx;
    }

    /**
     * 处理本次请求，分析并获取请求转发的参数
     * @return {Promise<any>}
     */


    (0, _createClass3.default)(Fastest, [{
        key: 'proxyRequest',
        value: function proxyRequest() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var requestUrl = _this.ctx.request.url;
                var _proxyEnv = _this.proxyEnv,
                    originDomain = _proxyEnv.originDomain,
                    rules = _proxyEnv.rules;

                // 请求转发参数

                var proxyRequestOpts = new ProxyRequestOpts(originDomain, requestUrl);

                // 从规则中寻找，如果本次请求链接中有符合转发标记的，则将其请求修改转发
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];

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
    }, {
        key: 'getRewriteHtml',
        value: function getRewriteHtml(htmlContent) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var _proxyEnv2 = _this2.proxyEnv,
                    proxyDomain = _proxyEnv2.proxyDomain,
                    rules = _proxyEnv2.rules;

                // html 文件内容

                var newHtmlContent = htmlContent;

                // 根据规则，依次进行转发替换，将匹配的请求转发到 fastest 上
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];

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
    }]);
    return Fastest;
}();

module.exports = Fastest;