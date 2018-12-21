const chai = require('chai');
const expect = chai.expect;

const fastestProxy = require('../../lib/fastest/fastest-proxy');

const url1 = 'http://fastest2.now.qq.com/vhost/11_url_cn/vhost/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152';
const url2 = 'http://fastest2.now.qq.com/vhost/now_qq_com/cgi-bin/vhost/now/abc';

const pattern1 = '11.url.cn';
const pattern2 = 'now.qq.com';
const pattern3 = 'now.qq.com/cgi-bin';

describe('./lib/fastest/fastest-proxy.js replaceDotToUnderline()', () => {
    it('11.url.cn should return 11_url_cn', () => {
        expect(fastestProxy.replaceDotToUnderline('11.url.cn')).to.equal('11_url_cn');
    });

    it('now.qq.com/cgi-bin should return now_qq_com/cgi-bin', () => {
        expect(fastestProxy.replaceDotToUnderline('now.qq.com/cgi-bin')).to.equal('now_qq_com/cgi-bin');
    });
});

describe('./lib/fastest/fastest-proxy.js isMatchVHost()', () => {
    it('check url1 & pattern1 should return true', () => {
        expect(fastestProxy.isMatchVHost(url1, pattern1)).to.be.true;
    });

    it('check url1 & pattern2 should return false', () => {
        expect(fastestProxy.isMatchVHost(url1, pattern2)).to.be.false;
    });

    it('check url2 & pattern2 should return false', () => {
        expect(fastestProxy.isMatchVHost(url2, pattern2)).to.be.false;
    });

    it('check url2 & pattern3 should return true', () => {
        expect(fastestProxy.isMatchVHost(url2, pattern3)).to.be.true;
    });
});

describe('./lib/fastest/fastest-proxy.js removeVHost()', () => {
    it('check url1 and pattern1', () => {
        expect(fastestProxy.removeVHost(url1, pattern1)).to.equal('http://fastest2.now.qq.com/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152');
    });

    it('check url1 and pattern2', () => {
        expect(fastestProxy.removeVHost(url1, pattern2)).to.equal(url1);
    });

    it('check url2 and pattern2', () => {
        expect(fastestProxy.removeVHost(url2, pattern2)).to.equal(url2);
    });

    it('check url2 and pattern3', () => {
        expect(fastestProxy.removeVHost(url2, pattern3)).to.equal('http://fastest2.now.qq.com/now/abc');
    });
});