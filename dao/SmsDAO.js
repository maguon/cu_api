//var dateUtil = require('../util/DateUtil.js');
//var smsConfig = require('../config/SmsConfig.js');
var https = require('https');
var http = require('http');
var encrypt = require('../util/Encrypt.js')
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('SmsDAO.js');

function httpSend(msg, callback) {
    var d = new Date();
    var timeStampStr = dateUtil.getDateFormat(d, 'yyyyMMddhhmmss');

    var originSignStr = smsConfig.smsOptions.accountSID + smsConfig.smsOptions.accountToken + timeStampStr;
    var signature = encrypt.encryptByMd5NoKey(originSignStr);

    var originAuthStr = smsConfig.smsOptions.accountSID + ":" + timeStampStr;
    var auth = encrypt.base64Encode(originAuthStr);
    var url = "/2013-12-26/" + smsConfig.smsOptions.accountType + "/" +
        smsConfig.smsOptions.accountSID + "/" + smsConfig.smsOptions.action + "?sig=";

    url = url + signature;
    var postData = JSON.stringify(msg);
    var options = {
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

    var httpsReq = https.request(options, function (result) {
        var data = "";
        result.setEncoding('utf8');
        result.on('data', function (d) {
            data += d;
        }).on('end', function () {
            var resObj = eval("(" + data + ")");
            logger.info("httpSend " + resObj);
            callback(null, resObj);
        }).on('error', function (e) {
            logger.error("httpSend " + e.message);
            callback(e, null);
        });

    });

    httpsReq.write(postData + "\n", 'utf-8');
    httpsReq.end();
    httpsReq.on('error', function (e) {
        callback(e, null)
    });
}

function sendSms(params, callback) {
    var msg = {
        to: params.phone,
        appId: smsConfig.smsOptions.appSID,
        templateId: params.templateId,
        datas: [params.captcha, '15']
    };
    httpSend(msg, callback);
}

module.exports = {
    sendSms: sendSms
}