'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Koa = require('koa');
var _ = require('./util');

// 模拟请求了配置管理页的数据
var remoteFastestConfig = require('../mock/data1');

module.exports = function (server, opts) {
    var app = new Koa();

    app.use(function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(ctx, next) {
            var fastestConfigId, envList, curFastestConfig, customRules, productionDomain, testDomain, rules;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            // 获得 fastest 配置项 ID
                            // let confIndex = ctx.query['_fst_idx'] || ctx.cookies.get('_fst_idx') || getUrlParam('_fst_idx', ctx.request.headers.referer) || 27;
                            fastestConfigId = 27;

                            // 环境列表

                            envList = [];

                            if (remoteFastestConfig.retcode === 0) {
                                envList = remoteFastestConfig.data;
                            }

                            // 获得当前的 fastest 配置项
                            curFastestConfig = _.getConfById(envList, fastestConfigId);

                            // 获得用户配置的规则

                            customRules = _.formatRules(curFastestConfig.rules);

                            // 生产环境的域名

                            productionDomain = curFastestConfig.product_domain;

                            // 测试环境的域名

                            testDomain = 'fastest2.' + productionDomain;

                            // 完整的规则

                            rules = ['/^https?://' + testDomain + '/(.*.(js|html|css|png|jpg|gif|jpeg|svg|blob|ttf|woff|woff2|mp3).*)$/ fastest://', testDomain + ' ' + productionDomain].concat(_toConsumableArray(customRules));


                            console.log('---rulesServer.js rules', rules);

                            // ？
                            ctx.body = {
                                rules: rules.join('\n')
                            };

                            // 将配置参数传递下去，后续流程需要用到这些配置
                            opts.curFastestConfig = curFastestConfig;

                            _context.next = 13;
                            return next();

                        case 13:
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
    // console.log('whistle.script rulesServer start: ', envList);
};