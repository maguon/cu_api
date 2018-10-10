'use strict';
let smsConfig = require('../config/SmsConfig.js');
let encrypt = require('../util/Encrypt.js');
let xinge = require('xinge');
let xingeApp = new xinge.XingeApp(smsConfig.xingeOptions.accessId, smsConfig.xingeOptions.secretKey);

const getXingeMD5=(params,timestamp)=>{
    let paramString = getXingeParamString(params)
    let originString = 'GET'+smsConfig.xingeOptions.host + smsConfig.xingeOptions.url + 'access_id='+
        smsConfig.xingeOptions.accessId+paramString+'timestamp=' + timestamp+ smsConfig.xingeOptions.secretKey;
    console.log(originString);
    let md5String =  encrypt.encryptByMd5NoKey(originString);
    console.log(md5String);
    return md5String;
}

const getXingeParamString=(params)=>{
    let paramsString = "";
    for(var i in params) {
        paramsString = paramsString +i+ "="+params[i];
    }
    return paramsString
}
const getBaseStyle=()=>{
    let style = new xinge.Style();
    style.ring = 1;
    style.vibrate = 1;
    style.light = 1;
    style.builderId = 77;
    return style;
}
const getBaseAndroidMsg=(title, content, style, action)=> {
    let androidMessage = new xinge.AndroidMessage();
    androidMessage.type = xinge.MESSAGE_TYPE_NOTIFICATION;
    androidMessage.title = title;
    androidMessage.content = content;
    androidMessage.style = style;
    androidMessage.action = action;
    androidMessage.expireTime = 2 * 60 * 60;
    androidMessage.multiPkg = 0;
    return androidMessage;
}
const getBaseAction=()=> {
    let action = new xinge.ClickAction();
    action.actionType = xinge.ACTION_TYPE_ACTIVITY;
    return action;
}
const pushMsg=(params, callback)=> {
    let message =  getBaseAndroidMsg(params.title, params.content, getBaseStyle(), getBaseAction())
    xingeApp.pushToSingleDevice(params.deviceToken, message, 0, function (error, result) {
        callback(error, result);
    });


}


module.exports = {
    pushMsg,
    getXingeMD5
}