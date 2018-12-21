class RecoverResult {
    constructor(host, url) {
        this.host = host;
        this.url = url;

        // 重要 fullUrl 一定要修改，因为后续 whistle 在调用 urlParse 方法时是拿这个值处理的
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

class Fastest {
    constructor(proxyEnv, ctx) {
        this.proxyEnv = proxyEnv;
        this.ctx = ctx;
    }

    recoverRequest() {
        return new Promise((resolve, reject) => {
            const requestUrl = this.ctx.request.url;
            const { originDomain, rules } = this.proxyEnv;

            let recoverResult = new RecoverResult(originDomain, requestUrl);

            // TODO 如果支持用户自定义输入，则这里可能需要限制下书写规范，或者看看 whistle 是怎么识别哪些是 pattern
            for (let i = 0; i < rules.length; i++) {
                let rule = rules[i];

                // 如果当前的请求链接是追加了 host 的场景，则需要将 host 信息解析出来
                if (rule.isProxyTypeOfHost(recoverResult.url)) {
                    recoverResult.update(rule.getProxyTypeOfHostResult(recoverResult.url));
                    break;
                }

                // TODO 要考虑请求转发的场景
            }

            resolve(recoverResult);
        });
    }
}

module.exports = Fastest;