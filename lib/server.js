'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Koa = require('koa');
var onerror = require('koa-onerror');
var qs = require('querystring');
var iconv = require('iconv-lite');
var util = require('./util');

var body = Symbol('body');
var text = Symbol('text');

var getBody = function getBody(stream) {
    var result = stream[body];
    if (!result) {
        result = util.getStreamBuffer(stream);
        stream[body] = result;
    }
    return result;
};

var getText = function getText(stream) {
    if (!util.isText(stream.headers)) {
        return Promise.resolve(null);
    }
    var result = stream[text];
    if (!result) {
        result = getBody(stream).then(function (buf) {
            return buf ? iconv.decode(buf, util.getCharset(stream.headers)) : '';
        });
        stream[text] = result;
    }
    return result;
};

// 本文件中代码实现参考了 https://github.com/whistle-plugins/whistle.script/blob/master/lib/server.js

module.exports = function (server, options) {
    var app = new Koa();

    onerror(app);

    app.use(function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, next) {
            var _util$getDataSource, dataSource, clearup, resPromise, myNext, _require, handleRequest, search, getReqBody, getReqText, res;

            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            // Object.keys(ctx.request) = [ 'app', 'req', 'res', 'ctx', 'response', 'originalUrl' ]
                            util.setupContext(ctx, options);

                            _util$getDataSource = util.getDataSource(), dataSource = _util$getDataSource.dataSource, clearup = _util$getDataSource.clearup;

                            ctx.dataSource = dataSource;

                            resPromise = void 0;

                            myNext = function myNext(opts) {
                                if (!resPromise) {
                                    opts = util.parseOptions(opts);
                                    var req = ctx.req;

                                    var getReqBody = function getReqBody() {
                                        if (!req[body]) {
                                            return Promise.resolve();
                                        }
                                        return ctx.getReqBody();
                                    };
                                    resPromise = getReqBody().then(function (reqBody) {
                                        if (reqBody && req.body === undefined) {
                                            req.body = reqBody;
                                        }
                                        return util.request(ctx, opts).then(function (svrRes) {
                                            ctx.status = svrRes.statusCode;
                                            Object.keys(svrRes.headers).forEach(function (name) {
                                                if (!ctx.res.getHeader(name)) {
                                                    ctx.set(name, svrRes.headers[name]);
                                                }
                                            });
                                            var getResBody = function getResBody() {
                                                return getBody(svrRes);
                                            };
                                            var getResText = function getResText() {
                                                return getText(svrRes);
                                            };
                                            ctx.getResBody = getResBody;
                                            ctx.getResText = getResText;
                                            return svrRes;
                                        });
                                    });
                                }
                                return resPromise;
                            };

                            // 执行自己的业务逻辑


                            _require = require('./fastest/serverHandler'), handleRequest = _require.handleRequest;
                            _context.prev = 6;
                            search = ctx.reqOptions.search;

                            ctx.query = search ? qs.parse(search.slice(1)) : {};

                            getReqBody = function getReqBody() {
                                return getBody(ctx.req);
                            };

                            getReqText = function getReqText() {
                                return getText(ctx.req);
                            };

                            ctx.getReqBody = getReqBody;
                            ctx.getReqText = getReqText;
                            ctx.getReqForm = function () {
                                if (!/application\/x-www-form-urlencoded/i.test(ctx.get('content-type'))) {
                                    return Promise.resolve({});
                                }
                                return getReqText().then(qs.parse);
                            };

                            _context.next = 16;
                            return handleRequest(ctx, myNext);

                        case 16:
                            if (!(resPromise && ctx.body === undefined)) {
                                _context.next = 30;
                                break;
                            }

                            _context.next = 19;
                            return myNext();

                        case 19:
                            res = _context.sent;

                            if (!res[body]) {
                                _context.next = 27;
                                break;
                            }

                            _context.next = 23;
                            return ctx.getResBody();

                        case 23:
                            ctx.body = _context.sent;

                            ctx.remove('content-encoding');
                            _context.next = 28;
                            break;

                        case 27:
                            ctx.body = res;

                        case 28:
                            _context.next = 31;
                            break;

                        case 30:
                            ctx.remove('content-encoding');

                        case 31:
                            ctx.remove('content-length');

                        case 32:
                            _context.prev = 32;

                            clearup();
                            return _context.finish(32);

                        case 35:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[6,, 32, 35]]);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());

    server.on('request', app.callback());
};