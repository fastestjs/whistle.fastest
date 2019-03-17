const chai = require('chai');
const expect = chai.expect;

const fastestProxy = require('../../lib/fastest/fastest-proxy');

const url1 = 'http://fastest2.now.qq.com/_fst_/11_url_cn/_fst_/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152';
const url2 = 'http://fastest2.now.qq.com/_fst_/now_qq_com/_fst_/index.html';
const url3 = 'http://fastest2.now.qq.com/_fst_/now_qq_com/cgi-bin/_fst_/now/abc';

const url1Orignal = 'http://11.url.cn/now/activity/spring-festival-2019/index_b4980e63.js?_bid=152';
const url2Orignal = 'http://now.qq.com/index.html';
const url3Orignal = 'http://now.qq.com/cgi-bin/now/abc';

const pattern1 = '11.url.cn';
const pattern2 = 'now.qq.com';
const pattern3 = 'now.qq.com/cgi-bin';

describe('./lib/fastest/fastest-proxy.js MATCH_PROXY_TAG', () => {
    it('MATCH_PROXY_TAG is _fst_', () => {
        expect(fastestProxy.MATCH_PROXY_TAG).to.equal('_fst_');
    });
});

describe('./lib/fastest/fastest-proxy.js isMatchVProxy(requestUrl, pattern)', () => {
    it('check url1 & pattern1 should return true', () => {
        expect(fastestProxy.isMatchVProxy(url1, pattern1)).to.be.true;
    });

    it('check url2 & pattern2 should return true', () => {
        expect(fastestProxy.isMatchVProxy(url2, pattern2)).to.be.true;
    });

    it('check url3& pattern3 should return true', () => {
        expect(fastestProxy.isMatchVProxy(url3, pattern3)).to.be.true;
    });

    it('check url1 & pattern2 should return false', () => {
        expect(fastestProxy.isMatchVProxy(url1, pattern2)).to.be.false;
    });

    it('check url2 & pattern3 should return false', () => {
        expect(fastestProxy.isMatchVProxy(url2, pattern3)).to.be.false;
    });

    it('check url3 & pattern2 should return false', () => {
        expect(fastestProxy.isMatchVProxy(url3, pattern2)).to.be.false;
    });
});

// describe('./lib/fastest/fastest-proxy.js removeVProxy(requestUrl, pattern)', () => {
//     it('check url1 and pattern1 should removed', () => {
//         expect(fastestProxy.removeVProxy(url1, pattern1)).to.equal(url1Orignal);
//     });
//
//     it('check url2 and pattern2 should removed', () => {
//         expect(fastestProxy.removeVProxy(url2, pattern2)).to.equal(url2Orignal);
//     });
//
//     it('check url3 and pattern3 should removed', () => {
//         expect(fastestProxy.removeVProxy(url3, pattern3)).to.equal(url3Orignal);
//     });
//
//     it('check url1 and pattern2 should not removed', () => {
//         expect(fastestProxy.removeVProxy(url1, pattern2)).to.equal(url1);
//     });
//
//     it('check url2 and pattern3 should not removed', () => {
//         expect(fastestProxy.removeVProxy(url2, pattern3)).to.equal(url2);
//     });
//
//     it('check url3 and pattern2 should not removed', () => {
//         expect(fastestProxy.removeVProxy(url3, pattern2)).to.equal(url3);
//     });
//
// });
