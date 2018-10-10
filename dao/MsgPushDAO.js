var dateUtil = require('../util/DateUtil.js');
var smsConfig = require('../config/SmsConfig.js');
var https = require('https');
var http = require('http');
var encrypt = require('../util/Encrypt.js')
var httpUtil = require('../util/HttpUtil.js')
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('MsgPushDAO.js');
var xinge = require('xinge');
var xingeApp = new xinge.XingeApp(smsConfig.xingeOptions.accessId, smsConfig.xingeOptions.secretKey);

function getXingeMD5(params,timestamp){
    var paramString = getXingeParamString(params)
    var originString = 'GET'+smsConfig.xingeOptions.host + smsConfig.xingeOptions.url + 'access_id='+
        smsConfig.xingeOptions.accessId+paramString+'timestamp=' + timestamp+ smsConfig.xingeOptions.secretKey;
    console.log(originString);
    var md5String =  encrypt.encryptByMd5NoKey(originString);
    console.log(md5String);
    return md5String;
}

function getXingeParamString(params){
    var paramsString = "";
    for(var i in params) {
        paramsString = paramsString +i+ "="+params[i];
    }
    return paramsString
}
function getBaseStyle() {
    var style = new xinge.Style();
    style.ring = 1;
    style.vibrate = 1;
    style.light = 1;
    style.builderId = 77;
    return style;
}
function getBaseAndroidMsg(title, content, style, action) {
    var androidMessage = new xinge.AndroidMessage();
    androidMessage.type = xinge.MESSAGE_TYPE_NOTIFICATION;
    androidMessage.title = title;
    androidMessage.content = content;
    androidMessage.style = style;
    androidMessage.action = action;
    androidMessage.expireTime = 2 * 60 * 60;
    androidMessage.multiPkg = 0;
    return androidMessage;
}
function getBaseAction() {
    var action = new xinge.ClickAction();
    action.actionType = xinge.ACTION_TYPE_ACTIVITY;
    return action;
}
function pushMsg(params, callback) {
    var message =  getBaseAndroidMsg(params.title, params.content, getBaseStyle(), getBaseAction())
    xingeApp.pushToSingleDevice(params.deviceToken, message, 0, function (error, result) {
        callback(error, result);
    });


}


module.exports = {
    pushMsg : pushMsg
}