const { PassThrough } = require('stream');
const parseurl = require('parseurl');
const urlParse = require('url').parse;

exports.getConfById = (list, id) => {
    let ret = {};
    list.forEach(item => {
        if (item.id == id) {
            ret = item;
        }
    });
    return ret;
};

exports.formatRules = (rules = []) => {
    let ret = [];
    rules.forEach(rule => {
        let item = `${rule.rule} ${rule.host}`;
        ret.push(item);
    });
    return ret;
};

const clearWhistleHeaders = (headers, options) => {
    const result = {};
    if (!headers) {
        return result;
    }
    if (!options) {
        return Object.assign({}, headers);
    }
    const removeHeaders = {};
    Object.keys(options).forEach(key => removeHeaders[options[key]] = 1);
    Object.keys(headers).forEach((name) => {
        if (!removeHeaders[name]) {
            result[name] = headers[name];
        }
    });
    return result;
};

exports.request = (ctx, opts) => {
    opts = opts || {};
    const { req } = ctx;
    const options = parseurl(req);
    options.followRedirect = req.followRedirect || false;
    options.headers = clearWhistleHeaders(req.headers, ctx.options);
    options.method = req.method;
    options.body = req;
    delete options.protocol;
    options.uri = ctx.fullUrl;
    let r = request;
    if (opts.proxyUrl) {
        console.log('有proxyUrl');
        r = request.defaults({ proxy: opts.proxyUrl });
    } else if (opts.host || options.port > 0) {
        const uri = urlParse(ctx.fullUrl);
        options.uri = uri;
        if (opts.host) {
            uri.hostname = opts.host;
            delete opts.hostname;
        }
        if (opts.port > 0) {
            uri.port = opts.port;
        }
    }

    if (req.body !== undefined) {
        delete req.headers['content-encoding'];
        options.body = req.body;
    }
    options.encoding = null;
    const transform = new PassThrough();
    return new Promise((resolve, reject) => {
        delete options.headers['content-length'];
        delete options.headers['transfer-encoding'];
        console.log('options: ', options);
        const res = r(options);
        res.pipe(transform);
        res.on('error', reject);
        res.on('response', ({ statusCode, headers }) => {
            res.on('error', err => transform.emit('error', err));
            transform.statusCode = statusCode;
            transform.headers = headers;
            resolve(transform);
        });
    });
};
