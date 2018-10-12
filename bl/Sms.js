'use strict';
let sysMsg = require('../util/SystemMsg.js');
let sysError = require('../util/SystemError.js');
let oauthUtil = require('../util/OAuthUtil.js');
let encrypt = require('../util/Encrypt.js');
let resUtil = require('../util/ResponseUtil.js');
let listOfValue = require('../util/ListOfValue.js');
let smsConfig = require('../config/SmsConfig.js');
let smsDAO = require('../dao/SmsDAO.js');
let serverLogger = require('../util/ServerLogger.js');
let logger = serverLogger.createLogger('Sms.js');

const sendPswdSms=(req,res,next)=>{
    let params = req.params;
    let captcha = "";
    new Promise((resolve,reject)=>{
        captcha = encrypt.getSmsRandomKey();
        oauthUtil.saveSignCode({phone:params.phone,code:captcha},(error,result)=>{
            if(error){
                logger.error(' sendPswdSms ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            }else{
                resolve();
            }
        })
    }).then(()=>{
        smsDAO.sendSms({phone:params.phone,captcha:captcha,templateId:smsConfig.smsOptions.signTemplateId},(error,result)=>{
            if(error){
                logger.error(' sendPswdSms ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            }else{
                logger.info(' sendPswdSms ' + 'success');
                resUtil.resetCreateRes(res,{insertId:1},null);
                return next();
            }
        })
    })
}
module.exports={
    sendPswdSms
}