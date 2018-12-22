const chai = require('chai');
const expect = chai.expect;

const fastestUtil = require('../../lib/fastest/util');

describe('./lib/fastest/util.js isIP()', () => {
    it('10.100.20.4 -> true', () => {
        expect(fastestUtil.isIP('10.100.20.4')).to.be.true;
    });

    it('11.url.cn -> false', () => {
        expect(fastestUtil.isIP('11.url.cn')).to.be.false;
    });
});

describe('./lib/fastest/util.js isHTML()', () => {
    it('text/html; charset=utf-8 -> true', () => {
        expect(fastestUtil.isHTML('text/html; charset=utf-8')).to.be.true;
    });

    it('application/x-javascript -> false', () => {
        expect(fastestUtil.isHTML('application/x-javascript')).to.be.false;
    });

    it('image/webp -> false', () => {
        expect(fastestUtil.isHTML('image/webp')).to.be.false;
    });
});

describe('./lib/fastest/util.js parseWhistleRule()', () => {
    it('check: now.qq.com 10.100.20.4', () => {
        expect(fastestUtil.parseWhistleRule('now.qq.com 10.100.20.4')).to.eql({
            pattern: 'now.qq.com',
            operatorURI: '10.100.20.4'
        });
    });

    it('check: now.qq.com/cgi-bin     10.100.20.4', () => {
        expect(fastestUtil.parseWhistleRule('now.qq.com/cgi-bin      10.100.20.4')).to.eql({
            pattern: 'now.qq.com/cgi-bin',
            operatorURI: '10.100.20.4'
        });
    });
});

describe('./lib/fastest/util.js replaceDotToUnderline()', () => {
    it('11.url.cn should return 11_url_cn', () => {
        expect(fastestUtil.replaceDotToUnderline('11.url.cn')).to.equal('11_url_cn');
    });

    it('now.qq.com/cgi-bin should return now_qq_com/cgi-bin', () => {
        expect(fastestUtil.replaceDotToUnderline('now.qq.com/cgi-bin')).to.equal('now_qq_com/cgi-bin');
    });
});