const chai = require('chai');
const expect = chai.expect;

const fastestCore = require('../../lib/fastest/fastest-core');

const url1 = '/vhost/11_url_cn/vhost/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152';
const url2 = '/vhost/now_qq_com/cgi-bin/vhost/now/abc';
const url3 = '/not/rewrite/x.js';

const fastestConfig1 = {
    id: 1,
    originDomain: 'now.qq.com',
    testDomain: 'fastest2.now.qq.com',
    rulesFromCustom: [
        'now.qq.com 10.100.64.201', // 用户自己配置
        'now.qq.com/cgi-bin 10.100.64.201', // 用户自己配置
        '11.url.cn 10.100.64.201', // 用户自己配置，且与主域一致
        '88.url.cn 10.100.64.136' // 用户自己配置，且与主域不一致，fastest不改动
    ]
};

describe('./lib/fastest/fastest-core.js getRewriteOpts()', () => {
    it('check fastestConfig1 and url1', () => {
        return fastestCore.getRewriteOpts({
            originDomain: fastestConfig1.originDomain,
            rulesFromCustom: fastestConfig1.rulesFromCustom,
            requestUrl: url1
        }).then((data) => {
            expect(data).to.eql({
                host: '11.url.cn',
                url: '/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152',
                fullUrl: 'http://11.url.cn/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152'
            });
        });
    });

    it('check fastestConfig1 and url2', () => {
        return fastestCore.getRewriteOpts({
            originDomain: fastestConfig1.originDomain,
            rulesFromCustom: fastestConfig1.rulesFromCustom,
            requestUrl: url2
        }).then((data) => {
            expect(data).to.eql({
                host: 'now.qq.com',
                url: '/now/abc',
                fullUrl: 'http://now.qq.com/now/abc'
            });
        });
    });

    it('check fastestConfig1 and url3', () => {
        return fastestCore.getRewriteOpts({
            originDomain: fastestConfig1.originDomain,
            rulesFromCustom: fastestConfig1.rulesFromCustom,
            requestUrl: url3
        }).then((data) => {
            expect(data).to.eql({
                host: 'now.qq.com',
                url: '/not/rewrite/x.js',
                fullUrl: 'http://now.qq.com/not/rewrite/x.js'
            });
        });
    });
});
