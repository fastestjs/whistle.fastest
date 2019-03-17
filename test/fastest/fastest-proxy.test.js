const chai = require('chai');
const expect = chai.expect;

const fastestProxy = require('../../lib/fastest/fastest-proxy');

const url1 = 'http://fastest2.now.qq.com/_fst_/11_url_cn/_fst_/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152';
const url2 = 'http://fastest2.now.qq.com/_fst_/now_qq_com/cgi-bin/_fst_/now/abc';

const pattern1 = '11.url.cn';
const pattern2 = 'now.qq.com';
const pattern3 = 'now.qq.com/cgi-bin';

describe('./lib/fastest/fastest-proxy.js MATCH_PROXY_TAG', () => {
    it('MATCH_PROXY_TAG is _fst_', () => {
        expect(fastestProxy.MATCH_PROXY_TAG).to.equal('_fst_');
    });
});

describe('./lib/fastest/fastest-proxy.js isMatchVProxy()', () => {
    it('check url1 & pattern1 should return true', () => {
        expect(fastestProxy.isMatchVProxy(url1, pattern1)).to.be.true;
    });

    it('check url1 & pattern2 should return false', () => {
        expect(fastestProxy.isMatchVProxy(url1, pattern2)).to.be.false;
    });

    it('check url2 & pattern2 should return false', () => {
        expect(fastestProxy.isMatchVProxy(url2, pattern2)).to.be.false;
    });

    it('check url2 & pattern3 should return true', () => {
        expect(fastestProxy.isMatchVProxy(url2, pattern3)).to.be.true;
    });
});

describe('./lib/fastest/fastest-proxy.js removeVProxy()', () => {
    it('check url1 and pattern1', () => {
        expect(fastestProxy.removeVProxy(url1, pattern1)).to.equal('http://fastest2.now.qq.com/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152');
    });

    it('check url1 and pattern2', () => {
        expect(fastestProxy.removeVProxy(url1, pattern2)).to.equal(url1);
    });

    it('check url2 and pattern2', () => {
        expect(fastestProxy.removeVProxy(url2, pattern2)).to.equal(url2);
    });

    it('check url2 and pattern3', () => {
        expect(fastestProxy.removeVProxy(url2, pattern3)).to.equal('http://fastest2.now.qq.com/now/abc');
    });
});