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

function getRequestParams(ctx) {
    // 获得代理环境ID
    var proxyEnvId = ctx.query['_fst_idx'] || ctx.cookies.get('_fst_idx') || fastestUtil.getParamFromURL('_fst_idx', ctx.request.headers.referer) || 27;

    // 代理环境的域名
    var proxyDomain = ctx.req.headers.host;

    // 代理环境的域名
    var uin = fastestUtil.getUin(ctx.cookies.get('uin'));

    return {
        proxyEnvId: proxyEnvId,
        proxyDomain: proxyDomain,
        uin: uin
    };
}

exports.handleRequestRules = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx) {
        var requestParams, fastestEnvData, proxyEnv;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // https://github.com/whistle-plugins/whistle.script#%E8%AE%BE%E7%BD%AE%E8%A7%84%E5%88%99
                        console.log('handleRequestRules start', ctx.fullUrl);

                        // 获取请求参数
                        requestParams = getRequestParams(ctx);

                        console.log('handleRequestRules requestParams', requestParams);

                        // 请求配置管理页的数据
                        fastestEnvData = db.getRemoteConfig(requestParams.proxyEnvId, requestParams.proxyDomain, { uin: requestParams.uin });

                        // 获得当前的 fastest 配置参数

                        proxyEnv = new ProxyEnv(fastestEnvData);

                        // 完整的规则

                        ctx.rules = ['/^https?://' + proxyEnv.proxyDomain + '/(.*.(js|html|css|png|jpg|gif|jpeg|svg|blob|ttf|woff|woff2|mp4).*)$/ fastest://', proxyEnv.proxyDomain + ' ' + proxyEnv.originDomain].concat((0, _toConsumableArray3.default)(proxyEnv.formatRules()));

                        // 将配置参数传递下去，后续流程需要用到这些配置
                        ctx.options.proxyEnv = proxyEnv;

                        console.log('handleRequestRules end');

                    case 8:
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