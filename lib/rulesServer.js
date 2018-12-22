'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Koa = require('koa');
var util = require('./whistle-util');

module.exports = function (server, options) {
    var app = new Koa();

    app.use(function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, next) {
            var _require, handleRequestRules;

            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            console.log('-------rulesServer.js start', ctx.fullUrl, ctx.request.header);
                            // console.log('-------rulesServer.js start typeof next', typeof next);
                            // console.log('-------rulesServer.js start options', options);

                            // 从 ctx 和 options 中获取并设置相关信息
                            util.setupContext(ctx, options);

                            // ctx.fullUrl = http://fastest2.now.qq.com/demo/ivweb-startkit/index.html?now_n_http=1&_fst_idx=37
                            // ctx.reqOptions = {
                            //     protocol: null,
                            //     slashes: null,
                            //     auth: null,
                            //     host: null,
                            //     port: null,
                            //     hostname: null,
                            //     hash: null,
                            //     search: '?now_n_http=1&_fst_idx=37',
                            //     query: 'now_n_http=1&_fst_idx=37',
                            //     pathname: '/demo/ivweb-startkit/index.html',
                            //     path: '/demo/ivweb-startkit/index.html?now_n_http=1&_fst_idx=37',
                            //     href: '/demo/ivweb-startkit/index.html?now_n_http=1&_fst_idx=37',
                            //     _raw: '/demo/ivweb-startkit/index.html?now_n_http=1&_fst_idx=37'
                            // };

                            // 执行自己的业务逻辑
                            _require = require('./fastest/rulesServerHandler'), handleRequestRules = _require.handleRequestRules;

                            // 处理规则

                            _context.next = 5;
                            return handleRequestRules(ctx, next);

                        case 5:

                            // 设置规则
                            util.responseRules(ctx);

                        case 6:
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