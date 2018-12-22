'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Koa = require('koa');
var onerror = require('koa-onerror');
var util = require('./whistle-util');
var iconv = require('iconv-lite');

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

// 异步请求函数，请求 fastest 服务端接口
function getFastestRewriteConfig(id, request) {
    return new Promise(function (resolve, reject) {
        // 通过 id 查询到配置
        var fastestConfig = {
            id: 1,
            originDomain: 'now.qq.com',
            testDomain: 'fastest2.now.qq.com',
            rulesFromFastest: [''],
            rulesFromCustom: ['now.qq.com 10.100.64.201', // 用户自己配置
            'now.qq.com/cgi-bin 10.100.64.201', // 用户自己配置
            '11.url.cn 10.100.64.201', // 用户自己配置，且与主域一致
            '88.url.cn 10.100.64.136' // 用户自己配置，且与主域不一致，fastest不改动
            ]
        };

        // 重新请求规则
        var rewriteConfig = {
            host: fastestConfig.originDomain,
            url: request.url
        };

        //--------------------------------------------------
        // begin: 遍历 fastestConfig.rulesFromCustom 进行替换
        //--------------------------------------------------

        // 举例：静态资源请求要修改回来
        // if (rewriteConfig.url.match(/rewrite\/11_url_cn/)) {
        //     rewriteConfig.host = '11.url.cn';
        //     rewriteConfig.url = rewriteConfig.url.replace(/rewrite\/11_url_cn\//gi, '');
        // }

        // 如果支持用户自定义输入，则这里可能需要限制下书写规范，或者看看 whistle 是怎么识别哪些是 pattern
        // 我们假设限制都是只支持 host 方式的配置
        fastestConfig.rulesFromCustom.forEach(function (rule) {
            var arr = rule.trim().split(/\s+/);
            var pattern = arr[0];

            // 如果是修改 host 场景
            if (rewriteConfig.url.match(new RegExp('vhost/' + pattern + '/vhost/'))) {
                // 注意 pattern 不一定是域名，可能包含路径
                rewriteConfig.host = pattern.split('/')[0];
                rewriteConfig.url = rewriteConfig.url.replace(new RegExp('vhost/' + pattern + '/vhost/', 'gi'), '');
            }
        });

        //--------------------------------------------------
        // end:遍历 fastestConfig.rulesFromCustom 进行替换
        //--------------------------------------------------

        // 重要 fullUrl 一定要修改，因为后续 urlParse 的时候是拿这个值处理的
        rewriteConfig.fullUrl = 'http://' + rewriteConfig.host + rewriteConfig.url;

        resolve(rewriteConfig);
    });
}

// 异步请求函数，请求 fastest 服务端接口
function getFastestRewriteHtml(id, htmlContent) {
    return new Promise(function (resolve, reject) {
        // 通过 id 查询到配置
        var fastestConfig = {
            id: 1,
            originDomain: 'now.qq.com',
            testDomain: 'fastest2.now.qq.com',
            rulesFromFastest: [''],
            rulesFromCustom: ['now.qq.com 10.100.64.201', // 用户自己配置
            'now.qq.com/cgi-bin 10.100.64.201', // 用户自己配置
            '11.url.cn 10.100.64.201', // 用户自己配置，且与主域一致
            '88.url.cn 10.100.64.136' // 用户自己配置，且与主域不一致，fastest不改动
            ]
        };

        console.log('----getFastestRewriteHtml--', id, htmlContent.length);

        // html 文件内容
        var newHtmlContent = htmlContent;

        //------------begin 修改 html 文件的内容--------------
        // 示例：替换静态资源
        // newHtmlContent = newHtmlContent.replace(/11\.url\.cn/gi, 'fastest2.now.qq.com/rewrite/11_url_cn');

        // 如果支持用户自定义输入，则这里可能需要限制下书写规范，或者看看 whistle 是怎么识别哪些是 pattern
        // 我们假设限制都是只支持 host 方式的配置
        fastestConfig.rulesFromCustom.forEach(function (rule) {
            var arr = rule.trim().split(/\s+/);
            var pattern = arr[0];
            var operatorURI = arr[1];
            var regIP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

            // 是否为修改host场景
            var isTypeHost = regIP.test(operatorURI);

            console.log('------', rule, isTypeHost);

            // 如果是修改 host 场景
            if (isTypeHost) {
                newHtmlContent = newHtmlContent.replace(new RegExp(pattern, 'gi'), fastestConfig.testDomain + '/vhost/' + pattern.replace(/\./gi, '_') + '/vhost');
            }
        });

        //------------end 修改 html 文件的内容---------------

        resolve({
            body: newHtmlContent,
            header: {
                'x-test': 'abcd'
            }
        });
    });
}

function requestProxy(ctx, opts) {
    opts = util.parseOptions(opts);

    console.log('requestProxy opts2---', opts, ctx.req[body]);

    var req = ctx.req;

    var getReqBody = function getReqBody() {
        if (!req[body]) {
            return Promise.resolve();
        }
        return getBody(ctx.req);
    };

    return getReqBody().then(function (reqBody) {
        console.log(' getReqBody() then  reqBody---', reqBody, req.body);
        if (reqBody && req.body === undefined) {
            req.body = reqBody;
        }
        return util.request(ctx, opts).then(function (svrRes) {

            console.log('=======util.request=====svrRes=', svrRes.statusCode);

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

            console.log('-------ready to return svrRes--------');
            return svrRes;
        });
    });
}

function getTestHtml() {
    return Promise.resolve('<h1>fastest</h1>');
}

module.exports = function (server, opts) {
    var app = new Koa();

    onerror(app);

    app.use(function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, next) {
            var _util$getDataSource, dataSource, clearup, curFastestConfig, rewriteConfig, whistleProxyUrl, requestProxyRes, resText;

            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            // ctx keys [ 'request',
                            //   'response',
                            //   'app',
                            //   'req',
                            //   'res',
                            //   'originalUrl',
                            //   'state' ]
                            // console.log('--server.js6---', Object.keys(ctx));

                            util.setupContext(ctx, opts);

                            // _.request(ctx, { proxyUrl: 'http://127.0.0.1:8080' });

                            // https://github.com/whistle-plugins/whistle.script#%E6%93%8D%E4%BD%9C%E8%AF%B7%E6%B1%82
                            console.log('handleRequest start', ctx.fullUrl);
                            _util$getDataSource = util.getDataSource(), dataSource = _util$getDataSource.dataSource, clearup = _util$getDataSource.clearup;

                            ctx.dataSource = dataSource;

                            // 由于上一步已经限制了域名为 testDomain 的才过来，因此此处可以不需要再判断是不是 testDomain 了。
                            curFastestConfig = opts.curFastestConfig;
                            _context.prev = 5;
                            _context.next = 8;
                            return getFastestRewriteConfig(curFastestConfig.id, ctx.request);

                        case 8:
                            rewriteConfig = _context.sent;

                            console.log('--rewriteConfig--', rewriteConfig);

                            // 重要 fullUrl 一定要修改，因为后续 urlParse 的时候是拿这个值处理的
                            ctx.fullUrl = rewriteConfig.fullUrl;

                            whistleProxyUrl = 'http://127.0.0.1:8080';

                            // 一定要设置使用 whistle 的代理，否则转发了请求之后，就无法真正获得测试环境的数据了

                            _context.next = 14;
                            return requestProxy(ctx, { proxyUrl: whistleProxyUrl });

                        case 14:
                            requestProxyRes = _context.sent;


                            console.log('-=-=-=-requestProxyRes=-=-=-', requestProxyRes.headers);

                            _context.next = 18;
                            return getText(requestProxyRes);

                        case 18:
                            resText = _context.sent;

                            // const resText = await getTestHtml();
                            console.log('========resText=======', resText);

                            // ctx.body ='<h1>hello</h1>'; // 修改响应内容
                            ctx.body = resText; // 修改响应内容

                            // ---------------------------------------------------------------------------
                            // begin 传递一些相关信息到 fastest 服务器，来判断如何重新修改结果
                            // ---------------------------------------------------------------------------
                            // 修改 html 文件，包括静态资源等路径修改
                            // if (headers && headers['content-type'] && headers['content-type'].indexOf('text/html') > -1) {
                            //     console.log('-----------html2---------');
                            //     // 获取文件内容
                            //     // const resText = await ctx.getResText();
                            //     //
                            //     // // 获取改写后的结果
                            //     // const rewriteHtml = await getFastestRewriteHtml(curFastestConfig.id, resText);
                            //
                            //     // 修改响应内容
                            //     // ctx.body = rewriteHtml.body; // 修改响应内容
                            //     ctx.body = '<h1>hello</h1>'; // 修改响应内容
                            //
                            //     // 可以设置一些自定义的响应头
                            //     // ctx.set(ctx.header);
                            //
                            //     ctx.remove('content-encoding');
                            // }else{
                            //     ctx.body = await next();
                            // }

                            console.log('handleRequest end');

                            console.log('----server.js----end');
                            _context.next = 25;
                            return next();

                        case 25:
                            _context.prev = 25;

                            console.log('-----finally------');
                            clearup();
                            return _context.finish(25);

                        case 29:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[5,, 25, 29]]);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());

    server.on('request', app.callback());
};