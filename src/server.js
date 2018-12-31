const Koa = require('koa');
const onerror = require('koa-onerror');
const qs = require('querystring');
const iconv = require('iconv-lite');
const util = require('./util');

const body = Symbol('body');
const text = Symbol('text');

const getBody = (stream) => {
    let result = stream[body];
    if (!result) {
        result = util.getStreamBuffer(stream);
        stream[body] = result;
    }
    return result;
};

const getText = (stream) => {
    if (!util.isText(stream.headers)) {
        return Promise.resolve(null);
    }
    let result = stream[text];
    if (!result) {
        result = getBody(stream).then((buf) => {
            return buf ? iconv.decode(buf, util.getCharset(stream.headers)) : '';
        });
        stream[text] = result;
    }
    return result;
};

// 本文件中代码实现参考了 https://github.com/whistle-plugins/whistle.script/blob/master/lib/server.js

module.exports = (server, options) => {
    const app = new Koa();

    onerror(app);

    app.use(async (ctx, next) => {
        // 这里拿不到 serverIp
        // ctx.request.req.originalReq
        // ctx.request.req.originalRes

        // Object.keys(ctx.request) = [ 'app', 'req', 'res', 'ctx', 'response', 'originalUrl' ]
        util.setupContext(ctx, options);

        const { dataSource, clearup } = util.getDataSource();
        ctx.dataSource = dataSource;

        let resPromise;
        const myNext = (opts) => {
            if (!resPromise) {
                opts = util.parseOptions(opts);
                const { req } = ctx;
                const getReqBody = () => {
                    if (!req[body]) {
                        return Promise.resolve();
                    }
                    return ctx.getReqBody();
                };
                resPromise = getReqBody().then((reqBody) => {
                    if (reqBody && req.body === undefined) {
                        req.body = reqBody;
                    }
                    return util.request(ctx, opts).then((svrRes) => {
                        ctx.status = svrRes.statusCode;
                        Object.keys(svrRes.headers).forEach((name) => {
                            if (!ctx.res.getHeader(name)) {
                                ctx.set(name, svrRes.headers[name]);
                            }
                        });
                        const getResBody = () => {
                            return getBody(svrRes);
                        };
                        const getResText = () => {
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
        const { handleRequest } = require('./fastest/serverHandler');

        try {
            const { search } = ctx.reqOptions;
            ctx.query = search ? qs.parse(search.slice(1)) : {};
            const getReqBody = () => {
                return getBody(ctx.req);
            };
            const getReqText = () => {
                return getText(ctx.req);
            };
            ctx.getReqBody = getReqBody;
            ctx.getReqText = getReqText;
            ctx.getReqForm = () => {
                if (!/application\/x-www-form-urlencoded/i.test(ctx.get('content-type'))) {
                    return Promise.resolve({});
                }
                return getReqText().then(qs.parse);
            };

            await handleRequest(ctx, myNext);

            if (resPromise && ctx.body === undefined) {
                const res = await myNext();
                if (res[body]) {
                    ctx.body = await ctx.getResBody();
                    ctx.remove('content-encoding');
                } else {
                    ctx.body = res;
                }
            } else {
                ctx.remove('content-encoding');
            }
            ctx.remove('content-length');

        } finally {
            clearup();
        }
    });

    server.on('request', app.callback());
};
