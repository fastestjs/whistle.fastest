/**
 * 代理请求的参数
 */
class ProxyRequestOpts {
    constructor(host, url) {
        this.host = host;
        this.url = url;
        this.fullUrl = this._getFullUrl();
    }

    update(data = {}) {
        this.host = data.host || this.host;
        this.url = data.url || this.url;
        this.fullUrl = this._getFullUrl();
    }

    _getFullUrl() {
        return `http://${this.host}${this.url}`;
    }
}

module.exports = ProxyRequestOpts;