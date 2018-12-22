'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fastestUtil = require('./fastest-util');
var Fastest = require('./Fastest');

exports.handleRequest = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, next) {
        var fastest, proxyRequestOpts, _ref2, headers, resText, rewriteHtml;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // https://github.com/whistle-plugins/whistle.script#%E6%93%8D%E4%BD%9C%E8%AF%B7%E6%B1%82
                        console.log('handleRequest start', ctx.fullUrl);

                        // 创建 fastest
                        fastest = new Fastest(ctx.options.proxyEnv, ctx);

                        // 处理本次请求，分析并获取请求转发的参数

                        _context.next = 4;
                        return fastest.proxyRequest();

                    case 4:
                        proxyRequestOpts = _context.sent;

                        // console.log('--proxyRequestOpts--', proxyRequestOpts);

                        // 重要 fullUrl 一定要修改，因为后续 whistle 在调用 urlParse 方法时是拿这个值处理的
                        ctx.fullUrl = proxyRequestOpts.fullUrl;

                        // 发送转发请求，注意一定要设置好代理
                        _context.next = 8;
                        return next({ proxyUrl: fastest.proxyEnv.whistleServer });

                    case 8:
                        _ref2 = _context.sent;
                        headers = _ref2.headers;

                        if (!fastestUtil.isHTML(headers['content-type'])) {
                            _context.next = 19;
                            break;
                        }

                        _context.next = 13;
                        return ctx.getResText();

                    case 13:
                        resText = _context.sent;
                        _context.next = 16;
                        return fastest.getRewriteHtml(resText);

                    case 16:
                        rewriteHtml = _context.sent;


                        // 修改响应内容
                        ctx.body = rewriteHtml.body; // 修改响应内容

                        // 可以设置一些自定义的响应头
                        ctx.set(rewriteHtml.header);

                    case 19:

                        // TODO 需要修改 js 文件所有请求 now.qq.com 中的地址为 fastest2.now.qq.com

                        console.log('handleRequest end');

                    case 20:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();