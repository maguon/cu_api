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
let userDAO = require('../dao/UserInfoDAO.js');

const sendPhoneSms=(req,res,next)=>{
    let params = req.params;
    let captcha = "";
    captcha = encrypt.getSmsRandomKey();
    new Promise((resolve,reject)=>{
        superviseDAO.querySupervise(params,(error,rows)=>{
            if(error){
                logger.error(' querySupervise ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else if(rows.length<1){
                logger.warn(' querySupervise ' + '查无此人');
                resUtil.resetFailedRes(res,'查无此人',null);
            }else{
                params.userId = rows[0].id;
                resolve();
            }
        })
    }).then(()=>{
        oauthUtil.saveSignCode({phone:params.phone,code:captcha},(error,result)=>{
            if(error){
                logger.error(' saveSignCode ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            }else{
                logger.info('saveSignCode' + 'success');
            }
        })
    }).then(()=>{
        params.captcha = captcha;
        params.userType = 2;
        oauthUtil.sendSignCode(params,(error,result)=>{
            if(error){
                logger.error(' sendSignCode ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            }else{
                resUtil.resetQueryRes(res,{success:true},null);
            }
        })
    })
}
const sendUserSms=(req,res,next)=>{
    let params = req.params;
    let captcha = "";
    captcha = encrypt.getSmsRandomKey();
    new Promise((resolve,reject)=>{
        oauthUtil.savePasswordCode({phone:params.phone,code:captcha},(error,result)=>{
            if(error){
                logger.error(' savePasswordCode ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else{
                logger.info('savePasswordCode' + 'success');
                resolve();
            }
        })
    }).then(()=>{
        params.captcha = captcha;
        params.userType = 1;
        oauthUtil.sendSignCode(params,(error,result)=>{
            if(error){
                logger.error(' sendSignCode ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else{
                logger.info('sendSignCode' + 'success');
                resUtil.resetQueryRes(res,{success:true},null);
                return next();
            }
        })
    })
}
const sendMessage=(req,res,next)=>{
    let params = req.params;
    params.userType = 1;
    params.plateNumber = params.licensePlate;
    new Promise((resolve,reject)=>{
        userDAO.queryUser({userId:params.userId},(error,rows)=>{
            if(error){
                logger.error(' queryUser ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else{
                logger.info('queryUser' + 'success');
                let phone = rows[0].phone;
                params.phone = phone;
                resolve();
            }
        })
    }).then(()=>{
        oauthUtil.sendMessage(params,(error,result)=>{
            if(error){
                logger.error(' sendMessage ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else{
                logger.info('sendMessage' + 'success');
                resUtil.resetQueryRes(res,{success:true},null);
                return next();
            }
        })
    })
}
module.exports={
    sendUserSms,
    sendPhoneSms,
    sendMessage
}