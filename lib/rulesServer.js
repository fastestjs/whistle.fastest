'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Koa = require('koa');
var util = require('./util');

module.exports = function (server, options) {

    // Object.keys(server)=[ 'domain',
    //     '_events',
    //     '_eventsCount',
    //     '_maxListeners',
    //     '_connections',
    //     '_handle',
    //     '_usingSlaves',
    //     '_slaves',
    //     '_unref',
    //     'allowHalfOpen',
    //     'pauseOnConnect',
    //     'httpAllowHalfOpen',
    //     'timeout',
    //     'keepAliveTimeout',
    //     '_pendingResponseData',
    //     'maxHeadersCount',
    //     '_connectionKey' ]

    var app = new Koa();

    app.use(function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx) {
            var _require, handleRequestRules;

            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            // 从 ctx 和 options 中获取并设置相关信息
                            util.setupContext(ctx, options);

                            // 从 url 中获取指定参数
                            // ctx.query['_fst_idx']=37

                            // 从 cookie 中获取指定参数
                            // ctx.cookies.get('_fst_idx')=37

                            // Object.keys(ctx) = [ 'request',
                            //   'response',
                            //   'app',
                            //   'req',
                            //   'res',
                            //   'originalUrl',
                            //   'state',
                            //   'options',
                            //   'reqOptions',
                            //   'fullUrl' ]

                            // console.log('ctx.cookies=', ctx.cookies);
                            // ctx.app = { subdomainOffset: 2, proxy: false, env: 'development' };

                            // fastest://ruleValue
                            // console.log(ctx.req.originalReq.ruleValue)

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

                            // console.log('ctx.req.headers:', ctx.req.headers);
                            // ctx.req.headers = { host: 'fastest2.now.qq.com',
                            //   pragma: 'no-cache',
                            //   'cache-control': 'no-cache',
                            //   'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
                            //   accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
                            //   referer: 'http://fastest2.now.qq.com/demo/ivweb-startkit/index.html?now_n_http=1&_fst_idx=37',
                            //   'accept-encoding': 'gzip, deflate',
                            //   'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                            //   cookie: '_supWebp=1',
                            //   'x-whistle-req-id': '1546000678915-365',
                            //   'x-whistle-full-url': 'http%3A%2F%2Ffastest2.now.qq.com%2Ffavicon.ico',
                            //   'x-forwarded-for': '127.0.0.1',
                            //   'x-whistle-client-port-1546000375942-49568-5489': '49890',
                            //   'x-whistle-method': 'GET',
                            //   'x-whistle-rule-value': 'hahahahahahahahahahha',
                            //   connection: 'close' };

                            // 执行自己的业务逻辑
                            _require = require('./fastest/rulesServerHandler'), handleRequestRules = _require.handleRequestRules;

                            // 处理规则

                            _context.next = 4;
                            return handleRequestRules(ctx);

                        case 4:

                            // 设置规则
                            util.responseRules(ctx);

                        case 5:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function (_x) {
            return _ref.apply(this, arguments);
        };
    }());

    server.on('request', app.callback());
};