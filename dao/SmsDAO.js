'use strict';
let dateUtil = require('../util/DateUtil.js');
let smsConfig = require('../config/SmsConfig.js');
let https = require('https');
let http = require('http');
let encrypt = require('../util/Encrypt.js')
let serverLogger = require('../util/ServerLogger.js');
let logger = serverLogger.createLogger('SmsDAO.js');

const httpSend=(msg, callback)=> {
    let d = new Date();
    let timeStampStr = dateUtil.getDateFormat(d, 'yyyyMMddhhmmss');

    let originSignStr = smsConfig.smsOptions.accountSID + smsConfig.smsOptions.accountToken + timeStampStr;
    let signature = encrypt.encryptByMd5NoKey(originSignStr);

    let originAuthStr = smsConfig.smsOptions.accountSID + ":" + timeStampStr;
    let auth = encrypt.base64Encode(originAuthStr);
    let url = "/2013-12-26/" + smsConfig.smsOptions.accountType + "/" +
        smsConfig.smsOptions.accountSID + "/" + smsConfig.smsOptions.action + "?sig=";

    url = url + signature;
    let postData = JSON.stringify(msg);
    let options = {
        host: smsConfig.smsOptions.server,
        port: smsConfig.smsOptions.port,
        path: url,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json; charset=utf8',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'Authorization': auth
        }
    };
    let httpsReq = https.request(options,(result)=>{
        let data = "";
        result.setEncoding('utf8');
        result.on('data',(d)=>{
            data += d;
        }).on('end',()=>{
            let resObj = eval("(" + data + ")");
            logger.info("httpSend " + resObj);
            callback(null, resObj);
        }).on('error', function (e) {
            logger.error("httpSend " + e.message);
            callback(e, null);
        });
    });
    httpsReq.write(postData + "\n", 'utf-8');
    httpsReq.end();
    httpsReq.on('error',(e)=>{
        callback(e, null)
    });
}
const sendSms=(params, callback)=>{
    let msg = {
        to: params.phone,
        appId: smsConfig.smsOptions.appSID,
        templateId: params.templateId,
        datas: [params.captcha, '15']
    };
    httpSend(msg, callback);
}
module.exports = {
    sendSms
}