const chai = require('chai');
const expect = chai.expect;

const fastestUtil = require('../../lib/fastest/fastest-util');

describe('./lib/fastest/fastest-util.js isIP(str)', () => {
    it('10.100.20.4 -> true', () => {
        expect(fastestUtil.isIP('10.100.20.4')).to.be.true;
    });

    it('11.url.cn -> false', () => {
        expect(fastestUtil.isIP('11.url.cn')).to.be.false;
    });
});

describe('./lib/fastest/fastest-util.js parseWhistleRule(rule)', () => {
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

describe('./lib/fastest/fastest-util.js isHTML(contentType)', () => {
    it('text/html; charset=utf-8 -> true', () => {
        expect(fastestUtil.isHTML('text/html; charset=utf-8')).to.be.true;
    });

    it('application/x-javascript -> false', () => {
        expect(fastestUtil.isHTML('application/x-javascript')).to.be.false;
    });

    it('application/javascript; charset=utf-8 -> false', () => {
        expect(fastestUtil.isHTML('application/javascript; charset=utf-8')).to.be.false;
    });

    it('application/json;charset=utf-8 -> false', () => {
        expect(fastestUtil.isHTML('application/json;charset=utf-8')).to.be.false;
    });

    it('text/css; charset=utf-8 -> false', () => {
        expect(fastestUtil.isHTML('text/css; charset=utf-8')).to.be.false;
    });

    it('image/webp -> false', () => {
        expect(fastestUtil.isHTML('image/webp')).to.be.false;
    });
});

describe('./lib/fastest/fastest-util.js isJavaScript(contentType)', () => {
    it('text/html; charset=utf-8 -> false', () => {
        expect(fastestUtil.isJavaScript('text/html; charset=utf-8')).to.be.false;
    });

    it('application/x-javascript -> true', () => {
        expect(fastestUtil.isJavaScript('application/x-javascript')).to.be.true;
    });

    it('text/javascript; chareset=UTF-8 -> true', () => {
        expect(fastestUtil.isJavaScript('text/javascript; chareset=UTF-8')).to.be.true;
    });

    it('application/javascript; charset=utf-8 -> true', () => {
        expect(fastestUtil.isJavaScript('application/javascript; charset=utf-8')).to.be.true;
    });

    it('application/json;charset=utf-8 -> false', () => {
        expect(fastestUtil.isJavaScript('application/json;charset=utf-8')).to.be.false;
    });

    it('text/css; charset=utf-8 -> false', () => {
        expect(fastestUtil.isJavaScript('text/css; charset=utf-8')).to.be.false;
    });

    it('image/webp -> false', () => {
        expect(fastestUtil.isJavaScript('image/webp')).to.be.false;
    });
});

describe('./lib/fastest/fastest-util.js isCss(contentType)', () => {
    it('text/html; charset=utf-8 -> false', () => {
        expect(fastestUtil.isCss('text/html; charset=utf-8')).to.be.false;
    });

    it('application/x-javascript -> false', () => {
        expect(fastestUtil.isCss('application/x-javascript')).to.be.false;
    });

    it('application/javascript; charset=utf-8 -> false', () => {
        expect(fastestUtil.isCss('application/javascript; charset=utf-8')).to.be.false;
    });

    it('application/json;charset=utf-8 -> false', () => {
        expect(fastestUtil.isCss('application/json;charset=utf-8')).to.be.false;
    });

    it('text/css; charset=utf-8 -> true', () => {
        expect(fastestUtil.isCss('text/css; charset=utf-8')).to.be.true;
    });

    it('text/css -> true', () => {
        expect(fastestUtil.isCss('text/css')).to.be.true;
    });

    it('image/webp -> false', () => {
        expect(fastestUtil.isCss('image/webp')).to.be.false;
    });
});

describe('./lib/fastest/fastest-util.js replaceDotToUnderline(str)', () => {
    it('11.url.cn should return 11_url_cn', () => {
        expect(fastestUtil.replaceDotToUnderline('11.url.cn')).to.equal('11_url_cn');
    });

    it('now.qq.com/cgi-bin should return now_qq_com/cgi-bin', () => {
        expect(fastestUtil.replaceDotToUnderline('now.qq.com/cgi-bin')).to.equal('now_qq_com/cgi-bin');
    });
});

describe('./lib/fastest/fastest-util.js removeIntegrityForHtml(htmlContent)', () => {
    it('contain integrity ', () => {
        let htmlContent = '<script type="text/javascript" src="./index.js" integrity="sha256-4HCvnM9yevyLsSI1LV4kuQsOEDkEX7+A13v8ll1yBFg= sha384-uHbkdqrH3SgKZDm8WRtFMC2YTKOgaVC5pUAs9oOLQxPCjTcuzIB25WulgXQpdCN0" crossorigin="anonymous"></script>';
        let result = '<script type="text/javascript" src="./index.js" crossorigin="anonymous"></script>';
        expect(fastestUtil.removeIntegrityForHtml(htmlContent)).to.equal(result);
    });

    it('contain integrity and end', () => {
        let htmlContent = '<script type="text/javascript" src="./index.js" integrity="sha256-4HCvnM9yevyLsSI1LV4kuQsOEDkEX7+A13v8ll1yBFg= sha384-uHbkdqrH3SgKZDm8WRtFMC2YTKOgaVC5pUAs9oOLQxPCjTcuzIB25WulgXQpdCN0"></script>';
        let result = '<script type="text/javascript" src="./index.js"></script>';
        expect(fastestUtil.removeIntegrityForHtml(htmlContent)).to.equal(result);
    });

    it('contain integrity and exist two script', () => {
        let htmlContent = '<script type="text/javascript" src="./index.js" integrity="sha256-4HCvnM9yevyLsSI1LV4kuQsOEDkEX7+A13v8ll1yBFg= sha384-uHbkdqrH3SgKZDm8WRtFMC2YTKOgaVC5pUAs9oOLQxPCjTcuzIB25WulgXQpdCN0"></script>';
        let result = '<script type="text/javascript" src="./index.js"></script>';
        expect(fastestUtil.removeIntegrityForHtml(htmlContent + htmlContent)).to.equal(result + result);
    });

    it('no integrity', () => {
        let htmlContent = '<script type="text/javascript" src="./index.js"></script>';
        expect(fastestUtil.removeIntegrityForHtml(htmlContent)).to.equal(htmlContent);
    });
});

describe('./lib/fastest/fastest-util.js getParamFromURL(name, url)', () => {
    const name = 'fastest';
    const url = 'https://domain/a/b?fastest=123&t=999';

    it('name is empty should return ""', () => {
        expect(fastestUtil.getParamFromURL('', url)).to.be.empty;
    });

    it('url is empty should return ""', () => {
        expect(fastestUtil.getParamFromURL(name, '')).to.be.empty;
    });

    it('get "fastest" should return 123', () => {
        expect(fastestUtil.getParamFromURL(name, url)).to.be.equal('123');
    });

    it('get "fastest2" should return ""', () => {
        expect(fastestUtil.getParamFromURL(name + '2', url)).to.be.empty;
    });
});

describe('./lib/fastest/fastest-util.js getUin(uinFromCookie)', () => {
    it('o123456 should return 123456', () => {
        expect(fastestUtil.getUin('o123456')).to.be.equal(123456);
    });

    it('123456 should return 123456', () => {
        expect(fastestUtil.getUin('o123456')).to.be.equal(123456);
    });

    it('"" should return 0', () => {
        expect(fastestUtil.getUin('')).to.be.equal(0);
    });
});