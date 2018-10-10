'use strict';
let sysMsg = require('../util/SystemMsg.js');
let sysError = require('../util/SystemError.js');
let oauthUtil = require('../util/OAuthUtil.js');
let encrypt = require('../util/Encrypt.js');
let resUtil = require('../util/ResponseUtil.js');
let listOfValue = require('../util/ListOfValue.js');
let smsConfig = require('../config/SmsConfig.js');
let smsDAO = require('../dao/SmsDAO.js');
//let userDAO = require('../dao/UserDAO.js');
let serverLogger = require('../util/ServerLogger.js');
let logger = serverLogger.createLogger('Sms.js');
const sendPswdSms=(req,res,next)=>{
    let params = req.params;
    let captcha = "";
    new Promise((resolve,reject)=>{
        userDAO.getUser(params,function(error,rows){
            if (error) {
                logger.error(' sendPswdSms ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if(rows ==null || rows.length==0){
                    logger.warn(' sendPswdSms ' +params.truckNum+ sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    return next();
                }else if(rows[0].status !=1){
                    logger.warn(' sendPswdSms ' +params.truckNum+ sysMsg.SYS_AUTH_TOKEN_ERROR);
                    resUtil.resetFailedRes(res,sysMsg.SYS_AUTH_TOKEN_ERROR);
                    return next();
                }else{
                    resolve();
                }
            }
        })
    }).then((resolve)=>{
        captcha = encrypt.getSmsRandomKey();
        oauthUtil.savePasswordCode({phone:params.mobile,code:captcha},function(error,result){
            if (error) {
                logger.error(' sendPswdSms ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                resolve();
            }
        })
    }).then(()=>{
        smsDAO.sendSms({phone:params.mobile,captcha:captcha,templateId:smsConfig.smsOptions.signTemplateId},function (error,result) {
            if (error) {
                logger.error(' sendPswdSms ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
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