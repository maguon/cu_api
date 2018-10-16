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
let superviseDAO = require('../dao/SuperviseDAO.js');

const updatePswdSendPswdSms=(req,res,next)=>{
    let params = req.params;
    let captcha = "";
    superviseDAO.querySupervise({phone:params.phone},(error,rows)=>{
        if(error){
            logger.error(' querySupervise ' + error.message);
            resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
            return next();
        }else if(rows.length<1){
            logger.warn('saveSignCode' + '没有此电话');
            resUtil.resetFailedRes(res,'没有此电话');
            return next();
        }else{
            captcha = encrypt.getSmsRandomKey();
            oauthUtil.saveSignCode({phone:params.phone,code:captcha},(error,result)=>{
                if(error){
                    logger.error(' saveSignCode ' + error.message);
                    resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    return next();
                }else{
                    let message = {
                        code:captcha,
                        phone:params.phone
                    }
                    logger.info('saveSignCode' + 'success');
                    resUtil.resetQueryRes(res,message,null);
                    return next();
                }
            })
        }
    })
}
const sendPswdSms=(req,res,next)=>{
    let params = req.params;
    let captcha = "";
    captcha = encrypt.getSmsRandomKey();
    oauthUtil.saveSignCode({phone:params.phone,code:captcha},(error,result)=>{
        if(error){
            logger.error(' sendPswdSms ' + error.message);
            resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
            return next();
        }else{
            let message = {
                code:captcha,
                phone:params.phone
            }
            logger.info('saveSignCode' + 'success');
            resUtil.resetQueryRes(res,message,null);
            return next();
        }
    })
}
module.exports={
    sendPswdSms,
    updatePswdSendPswdSms
}