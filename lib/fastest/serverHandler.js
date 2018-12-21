'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fastestCore = require('./fastest-core');

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

        // 去掉 script 标签上的 integrity 属性，不然会被安全策略阻挡，因为我们的确修改了 html 内容
        newHtmlContent = newHtmlContent.replace(/\s+integrity="[^"]*"/gi, '');

        //------------end 修改 html 文件的内容---------------

        resolve({
            body: newHtmlContent,
            header: {
                'x-test': 'abcd'
            }
        });
    });
}

//  如果Node >= 7.6，可以采用async await的方式
exports.handleRequest = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
        var curFastestConfig, rewriteConfig, whistleProxyUrl, _ref2, headers, resText, rewriteHtml;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        // https://github.com/whistle-plugins/whistle.script#%E6%93%8D%E4%BD%9C%E8%AF%B7%E6%B1%82
                        console.log('handleRequest start', ctx.fullUrl);
                        // console.log('handleRequest start==', ctx.request);

                        // 由于上一步已经限制了域名为 testDomain 的才过来，因此此处可以不需要再判断是不是 testDomain 了。
                        curFastestConfig = ctx.options.curFastestConfig;

                        // 通过id去fastest服务端查询，针对该次请求该如何转发
                        // const rewriteConfig = await fastestCore.getRewriteOpts(curFastestConfig.id, ctx.request);

                        _context.next = 4;
                        return fastestCore.getRewriteOpts({
                            originDomain: curFastestConfig.product_domain,
                            rulesFromCustom: ['now.qq.com 10.100.64.201', // 用户自己配置
                            'now.qq.com/cgi-bin 10.100.64.201', // 用户自己配置
                            '11.url.cn 10.100.64.201', // 用户自己配置，且与主域一致
                            '88.url.cn 10.100.64.136' // 用户自己配置，且与主域不一致，fastest不改动
                            ],
                            requestUrl: ctx.request.url
                        });

                    case 4:
                        rewriteConfig = _context.sent;

                        console.log('--rewriteConfig--', rewriteConfig);

                        // 重要 fullUrl 一定要修改，因为后续 urlParse 的时候是拿这个值处理的
                        ctx.fullUrl = rewriteConfig.fullUrl;

                        whistleProxyUrl = 'http://127.0.0.1:8080';

                        // 一定要设置使用 whistle 的代理，否则转发了请求之后，就无法真正获得测试环境的数据了

                        _context.next = 10;
                        return next({ proxyUrl: whistleProxyUrl });

                    case 10:
                        _ref2 = _context.sent;
                        headers = _ref2.headers;

                        if (!(headers && headers['content-type'] && headers['content-type'].indexOf('text/html') > -1)) {
                            _context.next = 21;
                            break;
                        }

                        _context.next = 15;
                        return ctx.getResText();

                    case 15:
                        resText = _context.sent;
                        _context.next = 18;
                        return getFastestRewriteHtml(curFastestConfig.id, resText);

                    case 18:
                        rewriteHtml = _context.sent;


                        // 修改响应内容
                        ctx.body = rewriteHtml.body; // 修改响应内容

                        // 可以设置一些自定义的响应头
                        ctx.set(ctx.header);

                    case 21:

                        // TODO 需要修改 js 文件所有请求 now.qq.com 中的地址为 fastest2.now.qq.com

                        console.log('handleRequest end');

                    case 22:
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