module.exports = {
    retcode: 0,
    result: {
        id: 27,
        name: '201测试环境',
        origin_domain: 'now.qq.com',
        proxy_domain: 'fastest2.now.qq.com',
        whistle_server: 'http://127.0.0.1:8080',
        status: 1,
        rules: [
            {
                type: 1,
                proxy_type: 1,
                rule: 'now.qq.com',
                host: '10.100.64.201',
                status: 1
            }, {
                type: 2,
                proxy_type: 1,
                rule: 'now.qq.com/cgi-bin',
                host: '10.100.64.201',
                status: 1
            }, {
                type: 1,
                proxy_type: 1,
                rule: '11.url.cn',
                host: '10.100.64.201',
                status: 1
            }
        ]
    }
};