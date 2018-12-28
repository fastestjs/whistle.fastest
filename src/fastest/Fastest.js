const fastestProxy = require('./fastest-proxy');
const fastestUtil = require('./fastest-util');
const ProxyRequestOpts = require('./ProxyRequestOpts');

class Fastest {
    constructor(proxyEnv, opts = {}) {
        this.proxyEnv = proxyEnv;

        this.opts = opts;

        // 远程请求的结果，详见 ../server.js
        // Object.keys(svrRes) = ['_readableState',
        //     'readable',
        //     'domain',
        //     '_events',
        //     '_eventsCount',
        //     '_maxListeners',
        //     '_writableState',
        //     'writable',
        //     'allowHalfOpen',
        //     '_transformState',
        //     'statusCode',
        //     'headers'];
        this.svrRes = null;
    }

    setSvrRes(svrRes) {
        this.svrRes = svrRes;

        // console.log('-----', this.opts.fullUrl, this.opts.url, this.svrRes.headers);
    }

    isHTML() {
        return fastestUtil.isHTML(this.getContentType());
    }

    isJavaScript() {
        return fastestUtil.isJavaScript(this.getContentType());
    }

    isCss() {
        return fastestUtil.isCss(this.getContentType());
    }

    getContentType() {
        return this.svrRes.headers['content-type'] || this.svrRes.headers['Content-Type'];
    }

    /**
     * 处理本次请求，分析并获取请求转发的参数
     *
     * @return {Promise<any>}
     */
    proxyRequest() {
        return new Promise((resolve, reject) => {
            const { originDomain, rules } = this.proxyEnv;
            const requestUrl = this.opts.url;

            // 1. 获取请求转发参数
            let proxyRequestOpts = new ProxyRequestOpts(originDomain, requestUrl);

            // 2. 从规则中寻找，如果本次请求链接中有符合转发标记的，则将其请求修改转发
            for (let i = 0; i < rules.length; i++) {
                let rule = rules[i];

                // 如果当前的请求链接是追加了 host 的场景，则需要将 host 信息解析出来
                if (rule.matchProxyTypeOfHost(proxyRequestOpts.url)) {
                    proxyRequestOpts.update(rule.getProxyTypeOfHostResult(proxyRequestOpts.url));
                    break;
                }
            }

            // 3. 返回结果
            resolve(proxyRequestOpts);
        });
    }

    /**
     * 获取重写 html 内容的结果
     *
     * @param {String} content 文件内容
     * @return {Promise<any>}
     */
    getRewriteHtml(content, ctx) {
        return new Promise((resolve, reject) => {
            const { proxyDomain, rules } = this.proxyEnv;

            // 1. 获取 html 文件内容
            let newContent = content;

            // 2. 根据规则，依次进行转发替换，将匹配的请求转发到 fastest 上
            for (let i = 0; i < rules.length; i++) {
                let rule = rules[i];

                newContent = fastestProxy.addVHost(newContent, rule.pattern, proxyDomain);
            }

            // 3. 去掉 script 标签上的 integrity 属性，不然会被安全策略阻挡，因为我们的确修改了 html 内容
            newContent = fastestUtil.removeIntegrityForHtml(newContent);

            // 是否使用eruda
            // let useEruda = ctx.cookies.get('nowh5testErudaEnv') || 0;

            // 4. 返回
            resolve({
                body: newContent,
                header: {
                    'x-test': 'html'
                }
            });
        });
    }

    /**
     * 获取重写静态资源内容的结果，例如 js 和 css
     *
     * @param {String} content 文件内容
     * @return {Promise<any>}
     */
    getRewriteStatic(content, ctx) {
        return new Promise((resolve, reject) => {
            const { proxyDomain, rules } = this.proxyEnv;

            // 1. 获取 html 文件内容
            let newContent = content;

            // 2. 根据规则，依次进行转发替换，将匹配的请求转发到 fastest 上
            for (let i = 0; i < rules.length; i++) {
                let rule = rules[i];

                newContent = fastestProxy.addVHost(newContent, rule.pattern, proxyDomain);
            }

            // 3. 返回
            resolve({
                body: newContent,
                header: {
                    'x-test': 'static'
                }
            });
        });
    }
}

module.exports = Fastest;