'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Koa = require('koa');
var onerror = require('koa-onerror');

module.exports = function (server, options) {
    var app = new Koa();

    onerror(app);

    app.use(function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, next) {
            var _require, handleResponseRules;

            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            // ctx.request.req.originalReq
                            // ctx.request.req.originalRes
                            // console.log('--8-ctx.request.req.originalReq----', ctx.request.req.originalReq, ctx.request.req.originalReq.fullUrl);
                            // console.log('--8-ctx.request.req.originalRes----', ctx.request.req.originalRes, ctx.request.req.originalReq.fullUrl);
                            //
                            // ctx.set({
                            //     'x-s-ip': ctx.request.req.originalRes.serverIp
                            // });

                            // console.log('---resRulesServer--ctx--',ctx)
                            // console.log('---resRulesServer--options--',options.proxyEnv)

                            // 执行自己的业务逻辑
                            _require = require('./fastest/resRulesServerHandler'), handleResponseRules = _require.handleResponseRules;

                            // 处理规则

                            _context.next = 3;
                            return handleResponseRules(ctx, options);

                        case 3:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());

    server.on('request', app.callback());
};