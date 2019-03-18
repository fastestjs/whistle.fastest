'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProxyEnv = require('./ProxyEnv');
var fastestUtil = require('./fastest-util');
var db = require('../fastest-server/db');

function getProxyEnvId(ctx) {
    // 获得代理环境ID
    return ctx.query['_fst_idx'] || ctx.cookies.get('_fst_idx') || fastestUtil.getParamFromURL('_fst_idx', ctx.request.headers.referer) || 27;
}

exports.handleRequestRules = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx) {
        var proxyEnvId, proxyEnv;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // https://github.com/whistle-plugins/whistle.script#%E8%AE%BE%E7%BD%AE%E8%A7%84%E5%88%99
                        console.log('==============================start=======================================');
                        console.log('[rulesServerHandler.js] start', ctx.fullUrl);

                        // 获取请求参数 proxyEnvId
                        proxyEnvId = getProxyEnvId(ctx);

                        console.log('[rulesServerHandler.js] proxyEnvId', proxyEnvId);

                        // 获得当前的 fastest 配置参数
                        proxyEnv = db.getRemoteConfig(proxyEnvId);

                        console.log('[rulesServerHandler.js] proxyEnv', proxyEnv);

                        // 如果有权使用规则
                        if (proxyEnv.target.isAvailable()) {
                            // 完整的规则
                            ctx.rules = [].concat((0, _toConsumableArray3.default)(proxyEnv.target.formatRules()));

                            // 正常情况下两者都是不一样的，但不排除意外场景
                            if (proxyEnv.proxyDomain !== proxyEnv.originDomain) {
                                ctx.rules = [
                                // `/^https?://${proxyEnv.proxyDomain}/(.*\.(js|html|css|png|jpg|gif|jpeg|svg|blob|ttf|woff|woff2|mp4).*)$/ fastest://`,
                                '/^https?://' + proxyEnv.proxyDomain + '/(.*)/ fastest://', proxyEnv.proxyDomain + ' ' + proxyEnv.originDomain].concat(ctx.rules);
                            }

                            // ctx.rules = [
                            //     '/^https?://fastest2.now.qq.com/(.*)/ fastest://',
                            //     'fastest2.now.qq.com now.qq.com',
                            //     'now.qq.com/cgi-bin 10.100.64.201',
                            //     '11.url.cn 10.100.64.201',
                            //     'now.qq.com 10.100.64.201'
                            // ];

                            console.log('[rulesServerHandler.js] ---ctx.rules---', ctx.rules);

                            // 将配置参数传递下去，后续流程需要用到这些配置
                            ctx.options.proxyEnv = proxyEnv;
                        } else {
                            console.log('[rulesServerHandler.js] target not available!', proxyEnv.target);
                        }

                        console.log('[rulesServerHandler.js] end');
                        console.log('=================================end====================================\n\n');

                    case 9:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}();