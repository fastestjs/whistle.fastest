const chai = require('chai');
const expect = chai.expect;

const fastestProxy = require('../../lib/fastest/fastest-proxy');

describe('./lib/fastest/fastest-proxy.js repaceDotToUnderline()', () => {
    it('11.url.cn should return 11_url_cn', () => {
        expect(fastestProxy.repaceDotToUnderline('11.url.cn')).to.equal('11_url_cn');
    });

    it('now.qq.com/cgi-bin should return now_qq_com/cgi-bin', () => {
        expect(fastestProxy.repaceDotToUnderline('now.qq.com/cgi-bin')).to.equal('now_qq_com/cgi-bin');
    });
});

describe('./lib/fastest/fastest-proxy.js isRewriteByHost()', () => {
    const url1 = 'http://fastest2.now.qq.com/vhost/11_url_cn/vhost/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152';
    const url2 = 'http://fastest2.now.qq.com/vhost/now_qq_com/cgi-bin/vhost/now/abc';

    const pattern1 = '11.url.cn';
    const pattern2 = 'now.qq.com';
    const pattern3 = 'now.qq.com/cgi-bin';

    it('url1 should rewrite pattern1', () => {
        expect(fastestProxy.isRewriteByHost(url1, pattern1)).to.be.true;
    });

    it('url1 should not rewrite pattern2', () => {
        expect(fastestProxy.isRewriteByHost(url1, pattern2)).to.be.false;
    });

    it('url2 should not rewrite pattern2', () => {
        expect(fastestProxy.isRewriteByHost(url2, pattern2)).to.be.false;
    });

    it('url2 should rewrite pattern3', () => {
        expect(fastestProxy.isRewriteByHost(url2, pattern3)).to.be.true;
    });

});
