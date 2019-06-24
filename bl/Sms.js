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

const sendSupervisePswdSms=(req,res,next)=>{
    let params = req.params;
    let captcha = "";
    captcha = encrypt.getSmsRandomKey();
    new Promise((resolve,reject)=>{
        superviseDAO.querySupervise(params,(error,rows)=>{
            if(error){
                logger.error('sendSupervisePswdSms querySupervise ' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                if(rows.length<1){
                    logger.warn('sendSupervisePswdSms querySupervise ' + 'No such person.');
                    resUtil.resetFailedRes(res,'查无此人',null);
                }else{
                    logger.info('sendSupervisePswdSms querySupervise ' + 'success');
                    params.userId = rows[0].id;
                    resolve();
                }
            }
        })
    }).then(()=>{
        oauthUtil.saveSupervisePswdCode({phone:params.phone,code:captcha},(error,result)=>{
            if(error){
                logger.error('sendSupervisePswdSms saveSupervisePswdCode ' + error.message);
                resUtil.resInternalError(error, res, next);
                return next();
            }else{
                logger.info('sendSupervisePswdSms saveSupervisePswdCode ' + 'success');
            }
        })
    }).then(()=>{
        params.captcha = captcha;
        params.userType = 2;
        oauthUtil.sendCaptcha(params,(error,result)=>{
            if(error){
                logger.error('sendSupervisePswdSms sendCaptcha ' + error.message);
                resUtil.resInternalError(error, res, next);
                return next();
            }else{
                logger.info('sendSupervisePswdSms sendCaptcha ' + 'success');
                resUtil.resetQueryRes(res,{success:true},null);
            }
        })
    })
}
const sendSupervisePhoneSms=(req,res,next)=>{
    let params = req.params;
    let captcha = "";
    captcha = encrypt.getSmsRandomKey();
    new Promise((resolve,reject)=>{
        oauthUtil.saveSupervisePhoneCode({phone:params.phone,code:captcha},(error,result)=>{
            if(error){
                logger.error('sendSupervisePhoneSms saveSupervisePhoneCode ' + error.message);
                resUtil.resInternalError(error, res, next);
                return next();
            }else{
                logger.info('sendSupervisePhoneSms saveSupervisePhoneCode ' + 'success');
                resolve();
            }
        })
    }).then(()=>{
        params.userId = params.superviseId;
        params.captcha = captcha;
        params.userType = 2;
        oauthUtil.sendCaptcha(params,(error,result)=>{
            if(error){
                logger.error('sendSupervisePhoneSms sendCaptcha ' + error.message);
                resUtil.resInternalError(error, res, next);
                return next();
            }else{
                logger.info('sendSupervisePhoneSms sendCaptcha ' + 'success');
                resUtil.resetQueryRes(res,{success:true},null);
            }
        })
    })
}
const sendUserSms=(req,res,next)=>{
    let params = req.params;
    let captcha = "";
    captcha = encrypt.getSmsRandomKey();
    userDAO.queryUser({phone:params.phone},(error,rows)=>{
        if(error){
            logger.error('sendUserSms queryUser ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else if(rows && rows.length > 0){
            logger.warn('sendUserSms queryUser '+'The phone is already tied.');
            resUtil.resetFailedRes(res,'手机已经被绑定',null);
        }else{
            new Promise((resolve,reject)=>{
                oauthUtil.saveUserPhoneCode({phone:params.phone,code:captcha},(error,result)=>{
                    if(error){
                        logger.error('sendUserSms saveUserPhoneCode ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    }else{
                        logger.info('sendUserSms saveUserPhoneCode ' + 'success');
                        resolve();
                    }
                })
            }).then(()=>{
                params.captcha = captcha;
                params.userType = 1;
                oauthUtil.sendCaptcha(params,(error,result)=>{
                    if(error){
                        logger.error('sendUserSms sendCaptcha ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    }else{
                        logger.info('sendUserSms sendCaptcha ' + 'success');
                        resUtil.resetQueryRes(res,{success:true},null);
                        return next();
                    }
                })
            })
        }
    })
}
const sendMessage=(req,res,next)=>{
    let params = req.params;
    params.userType = 1;
    params.plateNumber = params.licensePlate;
    // let myDate = new date();
    // params.dateId = moment(myDate).format('YYYYMMDD');
    new Promise((resolve,reject)=>{
        userDAO.queryUser({userId:params.userId},(error,rows)=>{
            if(error){
                logger.error('sendMessage queryUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('sendMessage queryUser ' + 'success');
                let phone = rows[0].phone;
                let openid = rows[0].wechat_id;
                params.openid = openid;
                params.phone = phone;
                resolve();
            }
        })
    }).then(()=>{
        oauthUtil.sendMessage(params,(error,result)=>{
            if(error){
                logger.error(' sendMessage oauth_sendMessage ' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('sendMessage oauth_sendMessage ' + 'success');
                resUtil.resetQueryRes(res,{success:true},null);
                return next();
            }
        })
    })
}
module.exports={
    sendUserSms,
    sendSupervisePswdSms,
    sendMessage,
    sendSupervisePhoneSms
}