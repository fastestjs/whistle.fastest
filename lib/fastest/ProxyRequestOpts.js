"use strict";

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 代理请求的参数
 */
var ProxyRequestOpts = function () {
    function ProxyRequestOpts(host, url) {
        (0, _classCallCheck3.default)(this, ProxyRequestOpts);

        this.host = host;
        this.url = url;
        this.fullUrl = this._getFullUrl();
    }

    (0, _createClass3.default)(ProxyRequestOpts, [{
        key: "update",
        value: function update() {
            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this.host = data.host || this.host;
            this.url = data.url || this.url;
            this.fullUrl = this._getFullUrl();
        }
    }, {
        key: "_getFullUrl",
        value: function _getFullUrl() {
            return "http://" + this.host + this.url;
        }
    }]);
    return ProxyRequestOpts;
}();

module.exports = ProxyRequestOpts;