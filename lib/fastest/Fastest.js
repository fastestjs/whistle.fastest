'use strict';

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fastestProxy = require('./fastest-proxy');
var fastestUtil = require('./fastest-util');
var ProxyRequestOpts = require('./ProxyRequestOpts');

var Fastest = function () {
    function Fastest(proxyEnv) {
        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        (0, _classCallCheck3.default)(this, Fastest);

        this.proxyEnv = proxyEnv;

        this.opts = opts;

        // 远程请求的结果，详见 ../server.js
        // Object.keys(svrRes) = ['_readableState',
        //     'readable',
        //     'domain',
        //     '_events',
        //     '_eventsCount',
        //     '_maxListeners',
        //     '_writableState',
        //     'writable',
        //     'allowHalfOpen',
        //     '_transformState',
        //     'statusCode',
        //     'headers'];
        this.svrRes = null;
    }

    (0, _createClass3.default)(Fastest, [{
        key: 'setSvrRes',
        value: function setSvrRes(svrRes) {
            this.svrRes = svrRes;

            // console.log('-----', this.opts.fullUrl, this.opts.url, this.svrRes.headers);
        }
    }, {
        key: 'isHTML',
        value: function isHTML() {
            return fastestUtil.isHTML(this._getContentType());
        }
    }, {
        key: 'isJavaScript',
        value: function isJavaScript() {
            return fastestUtil.isJavaScript(this._getContentType());
        }
    }, {
        key: 'isCss',
        value: function isCss() {
            return fastestUtil.isCss(this._getContentType());
        }
    }, {
        key: '_getContentType',
        value: function _getContentType() {
            return this.svrRes.headers['content-type'] || this.svrRes.headers['Content-Type'];
        }

        /**
         * 处理本次请求，分析并获取请求转发的参数
         *
         * @return {Promise<any>}
         */

    }, {
        key: 'proxyRequest',
        value: function proxyRequest() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var _proxyEnv = _this.proxyEnv,
                    originDomain = _proxyEnv.originDomain,
                    rules = _proxyEnv.rules;

                var requestUrl = _this.opts.url;

                // 1. 获取请求转发参数
                var proxyRequestOpts = new ProxyRequestOpts(originDomain, requestUrl);

                // 2. 从规则中寻找，如果本次请求链接中有符合转发标记的，则将其请求修改转发
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];

                    // 如果当前的请求链接是追加了 host 的场景，则需要将 host 信息解析出来
                    if (rule.matchProxyTypeOfHost(proxyRequestOpts.url)) {
                        proxyRequestOpts.update(rule.getProxyTypeOfHostResult(proxyRequestOpts.url));
                        break;
                    }
                }

                // 3. 返回结果
                resolve(proxyRequestOpts);
            });
        }

        /**
         * 获取重写 html 内容的结果
         * @param {String} htmlContent html 中内容
         * @return {Promise<any>}
         */

    }, {
        key: 'getRewriteHtml',
        value: function getRewriteHtml(htmlContent, ctx) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var _proxyEnv2 = _this2.proxyEnv,
                    proxyDomain = _proxyEnv2.proxyDomain,
                    rules = _proxyEnv2.rules;

                // 1. 获取 html 文件内容

                var newHtmlContent = htmlContent;

                // 2. 根据规则，依次进行转发替换，将匹配的请求转发到 fastest 上
                for (var i = 0; i < rules.length; i++) {
                    var rule = rules[i];

                    newHtmlContent = fastestProxy.addVHost(newHtmlContent, rule.pattern, proxyDomain);
                }

                // 3. 去掉 script 标签上的 integrity 属性，不然会被安全策略阻挡，因为我们的确修改了 html 内容
                newHtmlContent = fastestUtil.removeIntegrityForHtml(newHtmlContent);

                // 是否使用eruda
                // let useEruda = ctx.cookies.get('nowh5testErudaEnv') || 0;

                // 4. 返回
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