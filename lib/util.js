'use strict';

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parseurl = require('parseurl');
var zlib = require('zlib');
var request = require('request');
var urlParse = require('url').parse;

var _require = require('stream'),
    PassThrough = _require.PassThrough;

var _require2 = require('events'),
    EventEmitter = _require2.EventEmitter;

var dataSource = require('./dataSource');

exports.resHeaders = Symbol('resHeaders');
exports.resRawHeaders = Symbol('resRawHeaders');
exports.isFunction = function (fn) {
    return typeof fn === 'function';
};
exports.noop = function () {};
var getCharset = function getCharset(headers) {
    if (/charset=([^\s]+)/.test(headers['content-type'])) {
        return RegExp.$1;
    }
    return 'utf8';
};
exports.getCharset = getCharset;
exports.isText = function (headers) {
    var type = headers['content-type'];
    return !type || /javascript|css|html|json|xml|application\/x-www-form-urlencoded|text\//i.test(type);
};

var HOST_RE = /^([\w-]+)(?::(\d+))?$/;
var parseHost = function parseHost(host) {
    if (HOST_RE.test(host)) {
        return {
            host: RegExp.$1,
            port: RegExp.$2
        };
    }
};
var parseOptions = function parseOptions(options) {
    if (!options) {
        return {};
    }
    if (HOST_RE.test(options)) {
        return {
            host: RegExp.$1,
            port: RegExp.$2
        };
    }
    if (typeof options === 'string') {
        return parseHost(options);
    }
    if (!(options.port > 0)) {
        delete options.port;
        Object.assign(options, parseHost(options.host));
    }
    if (!options.host || typeof options.host !== 'string') {
        delete options.host;
    }
    var proxyUrl = options.proxyUrl;

    delete options.proxyUrl;
    if (proxyUrl && typeof proxyUrl === 'string') {
        proxyUrl = proxyUrl.replace(/^[^/]*:\/\/|\s+|\/.*$/g, '');
        options.proxyUrl = proxyUrl && 'http://' + proxyUrl;
    }
    return options;
};
exports.parseOptions = parseOptions;

var getValueFromHeaders = function getValueFromHeaders(headers, name) {
    name = headers[name];
    return name ? decodeURIComponent(name) : '';
};
exports.getValueFromHeaders = getValueFromHeaders;

var getRuleValue = function getRuleValue(headers, options) {
    var value = headers[options.RULE_VALUE_HEADER];
    if (!value) {
        return;
    }
    return decodeURIComponent(value);
};

exports.getRuleValue = getRuleValue;
var clearWhistleHeaders = function clearWhistleHeaders(headers, options) {
    var result = {};
    if (!headers) {
        return result;
    }
    if (!options) {
        return Object.assign({}, headers);
    }
    var removeHeaders = {};
    Object.keys(options).forEach(function (key) {
        return removeHeaders[options[key]] = 1;
    });
    Object.keys(headers).forEach(function (name) {
        if (!removeHeaders[name]) {
            result[name] = headers[name];
        }
    });
    return result;
};
exports.clearWhistleHeaders = clearWhistleHeaders;

exports.request = function (ctx, opts) {
    opts = opts || {};
    var req = ctx.req;

    var options = parseurl(req);
    options.followRedirect = req.followRedirect || false;
    options.headers = clearWhistleHeaders(req.headers, ctx.options);
    options.method = req.method;
    options.body = req;
    delete options.protocol;
    options.uri = ctx.fullUrl;
    var r = request;
    if (opts.proxyUrl) {
        r = request.defaults({ proxy: opts.proxyUrl });
    } else if (opts.host || options.port > 0) {
        var uri = urlParse(ctx.fullUrl);
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
    var transform = new PassThrough();
    return new Promise(function (resolve, reject) {
        delete options.headers['content-length'];
        delete options.headers['transfer-encoding'];
        var res = r(options);
        res.pipe(transform);
        res.on('error', reject);
        res.on('response', function (_ref) {
            var statusCode = _ref.statusCode,
                headers = _ref.headers;

            res.on('error', function (err) {
                return transform.emit('error', err);
            });
            transform.statusCode = statusCode;
            transform.headers = headers;
            resolve(transform);
        });
    });
};
var unzipBody = function unzipBody(headers, body, callback) {
    var unzip = void 0;
    var encoding = headers['content-encoding'];
    if (body && typeof encoding === 'string') {
        encoding = encoding.trim().toLowerCase();
        if (encoding === 'gzip') {
            unzip = zlib.gunzip.bind(zlib);
        } else if (encoding === 'gzip') {
            unzip = zlib.inflate.bind(zlib);
        }
    }
    if (!unzip) {
        return callback(null, body);
    }
    unzip(body, function (err, data) {
        if (err) {
            return zlib.inflateRaw(body, callback);
        }
        callback(null, data);
    });
};

exports.getStreamBuffer = function (stream) {
    return new Promise(function (resolve, reject) {
        var buffer = void 0;
        stream.on('data', function (data) {
            buffer = buffer ? Buffer.concat([buffer, data]) : data;
        });
        stream.on('end', function () {
            unzipBody(stream.headers, buffer, function (err, data) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data || null);
                }
            });
        });
        stream.on('error', reject);
    });
};

exports.setupContext = function (ctx, options) {
    ctx.options = options;
    ctx.reqOptions = parseurl(ctx.req);
    var fullUrl = getValueFromHeaders(ctx.headers, options.FULL_URL_HEADER);
    ctx.fullUrl = fullUrl;
};

exports.responseRules = function (ctx) {
    if (!ctx.body && (ctx.rules || ctx.values)) {
        ctx.body = {
            rules: Array.isArray(ctx.rules) ? ctx.rules.join('\n') : '' + ctx.rules,
            values: ctx.values
        };
    }
};

exports.getDataSource = function () {
    var ds = new EventEmitter();
    var handleData = function handleData(type, args) {
        ds.emit.apply(ds, [type].concat((0, _toConsumableArray3.default)(args)));
    };
    dataSource.on('data', handleData);
    return {
        dataSource: ds,
        clearup: function clearup() {
            dataSource.removeListener('data', handleData);
            ds.removeAllListeners();
        }
    };
};