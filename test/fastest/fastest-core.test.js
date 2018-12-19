const chai = require('chai');
const expect = chai.expect;

const fastestCore = require('../../lib/fastest/fastest-core');

const url1 = '/vhost/11_url_cn/vhost/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152';
const url2 = '/vhost/now_qq_com/cgi-bin/vhost/now/abc';

const pattern1 = '11.url.cn';
const pattern2 = 'now.qq.com';
const pattern3 = 'now.qq.com/cgi-bin';

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

describe.only('./lib/fastest/fastest-core.js getRewriteOpts()', () => {
    it('11.url.cn should return 11_url_cn', () => {
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
});
