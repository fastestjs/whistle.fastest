exports.handleResponseRules = async (ctx, options) => {
    // https://github.com/whistle-plugins/whistle.script#%E8%AE%BE%E7%BD%AE%E8%A7%84%E5%88%99
    console.log('===handleResponseRules start===', ctx.fullUrl);

    // console.log(ctx);

    console.log('--8-ctx.request.req.originalReq----', ctx.request.req.originalReq, ctx.request.req.originalReq.fullUrl);
    console.log('--8-ctx.request.req.originalRes----', ctx.request.req.originalRes, ctx.request.req.originalReq.fullUrl);

    console.log('--8-ctx.request----', ctx.request);

    console.log('--ctx.request.res.body--', ctx.request.res.body);
    console.log('--ctx.request.res.header--', ctx.request.res.header);
    console.log('--ctx.res.body--', ctx.res.body);
    console.log('--ctx.res.header--', ctx.res.header);
    // console.log('--ctx.request.res keys--', Object.keys(ctx.request.res));

    // ctx.set({
    //     'x-s-ip': ctx.request.req.originalRes.serverIp
    // });

    ctx.set('x-hli', 'good');
    ctx.request.res.set('x-hli2', 'good2');
    ctx.req.set('x-hli22', 'good22');
    ctx.res.set('x-hli22', 'good22');
    ctx.request.req.originalReq.set('x-hli33', 'good33');
    ctx.request.req.originalRes.set('x-hli44', 'good44');
    ctx.request.req.originalReq.headers('x-hli55', 'good55');

    // ctx.req.getReqSession((s) => {
    //     console.log('helinjiang====-=-=-=-=-=', s);
    // });

    console.log('===handleResponseRules end===');
};