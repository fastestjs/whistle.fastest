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