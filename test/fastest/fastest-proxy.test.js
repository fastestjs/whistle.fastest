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
