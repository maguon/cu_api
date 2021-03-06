'use strict';

const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const encrypt = require('../util/Encrypt.js');
const resUtil = require('../util/ResponseUtil.js');
const listOfValue = require('../util/ListOfValue.js');
const oAuthUtil = require('../util/OAuthUtil.js');
const adminUserDao = require('../dao/AdminUserDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('AdminUser.js');
const moment = require('moment/moment.js');

const createAdminUser = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        adminUserDao.queryAdminUser({phone:params.phone},(error,rows)=>{
            if (error) {
                logger.error('createAdminUser queryAdminUser ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG) ;
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn('createAdminUser queryAdminUser ' +params.phone+' '+ sysMsg.CUST_SIGNUP_REGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.CUST_SIGNUP_REGISTERED) ;
                    return next();
                }else{
                    resolve();
                }
            }
        })
    }).then(()=>{
        params.password = encrypt.encryptByMd5(params.password);
        adminUserDao.createAdminUser(params,(error,result)=>{
            if (error) {
                logger.error(' createAdminUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if(result && result.insertId>0){
                    logger.info(' createAdminUser ' + 'success');
                    let user = {
                        userId : result.insertId,
                        userStatus : listOfValue.USER_STATUS_ACTIVE
                    }
                    user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,user.userId,user.userStatus);
                    resUtil.resetQueryRes(res,user,null);
                }else{
                    logger.warn(' createAdminUser ' + 'false');
                    resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
                return next();
            }
        })
    })
}
const adminUserLogin = (req,res,next) =>{
    let params = req.params;
    adminUserDao.queryAdminUser({userName:params.userName},(error,rows)=>{
        if (error) {
            logger.error(' adminUserLogin queryAdminUser ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            if(rows && rows.length<1){
                logger.warn(' adminUserLogin queryAdminUser ' +params.userName+ ' No such user!');
                resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED) ;
                return next();
            }else{
                let passwordMd5 = encrypt.encryptByMd5(params.password);
                if(passwordMd5 != rows[0].password){
                    logger.warn(' adminUserLogin password ' +params.phone+ ' Login password error!');
                    resUtil.resetFailedRes(res,sysMsg.CUST_LOGIN_PSWD_ERROR) ;
                    return next();
                }else{
                    if(rows[0].status == listOfValue.ADMIN_USER_STATUS_NOT_ACTIVE){
                        let user = {
                            userId : rows[0].id,
                            userStatus : rows[0].status
                        }
                        logger.warn('adminUserLogin status ' +params.userName+ " not verified!");
                        resUtil.resetQueryRes(res,user,null);
                        return next();
                    }else{
                        let user = {
                            userId : rows[0].id,
                            userStatus : rows[0].status,
                            type: rows[0].type
                        }
                        user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.admin,user.userId,user.userStatus);
                        logger.info('adminUserLogin ' +params.userName+ " success");
                        resUtil.resetQueryRes(res,user,null);
                        return next();
                    }
                }
            }
        }
    })
}
const getAdminUserInfo = (req,res,next) => {
    let params = req.params;
    adminUserDao.queryAdminInfo(params,(error,rows)=>{
        if (error) {
            logger.error(' getAdminUserInfo ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' getAdminUserInfo ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
const updateAdminInfo = (req,res,next) => {
    let params = req.params;
    adminUserDao.updateInfo(params,(error,result)=>{
        if (error) {
            logger.error(' updateAdminInfo ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' updateAdminInfo ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const changeAdminPassword = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject) => {
        adminUserDao.queryAdminUser(params,(error,rows)=>{
            if (error) {
                logger.error(' changeAdminPassword queryAdminUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                if(rows && rows.length<1){
                    logger.warn(' changeAdminPassword queryAdminUser No such user!');
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    return next();
                }else{
                    if(encrypt.encryptByMd5(params.originPassword) != rows[0].password){
                        logger.warn(' changeAdminPassword queryAdminUser Original password error!');
                        resUtil.resetFailedRes(res,sysMsg.CUST_ORIGIN_PSWD_ERROR);
                        return next();
                    }else{
                        logger.info(' changeAdminPassword queryAdminUser ' + 'success');
                        resolve();
                    }
                }
            }
        })
    }).then(() => {
        params.password = encrypt.encryptByMd5(params.newPassword);
        adminUserDao.updatePassword(params,(error,result)=>{
            if (error) {
                logger.error(' changeAdminPassword updatePassword ' + error.message);
                resUtil.resInternalError(error, res, next);
            } else {
                logger.info(' changeAdminPassword updatePassword ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}
const getUserStat = (req,res,next) => {
    let params = req.params;
    adminUserDao.getUserStat(params,(error,result)=>{
        if (error) {
            logger.error(' getUserStat ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' getUserStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getUserCarStat = (req,res,next) => {
    let params = req.params;
    adminUserDao.getUserCarStat(params,(error,result)=>{
        if (error) {
            logger.error(' getUserCarStat ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' getUserCarStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getSuperviseStat = (req,res,next) => {
    let params = req.params;
    adminUserDao.getSuperviseStat(params,(error,result)=>{
        if (error) {
            logger.error(' getSuperviseStat ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' getSuperviseStat ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getCheckCarStatByMonth = (req,res,next) => {
    let params = req.params;
    adminUserDao.getCheckCarStatByMonth(params,(error,result)=>{
        if (error) {
            logger.error(' getCheckCarStatByMonth ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' getCheckCarStatByMonth ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getOrderStatByMonth = (req,res,next) => {
    let params = req.params;
    adminUserDao.getOrderStatByMonth(params,(error,result)=>{
        if (error) {
            logger.error(' getOrderStatByMonth ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' getOrderStatByMonth ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getLogStatByMonth = (req,res,next) => {
    let params = req.params;
    adminUserDao.getLogStatByMonth(params,(error,result)=>{
        if (error) {
            logger.error(' getLogStatByMonth ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' getLogStatByMonth ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getOrderFeedbackStatByMonth = (req,res,next) => {
    let params = req.params;
    adminUserDao.getOrderFeedbackStatByMonth(params,(error,result)=>{
        if (error) {
            logger.error(' getOrderFeedbackStatByMonth ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' getOrderFeedbackStatByMonth ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getPaymentFeeByMonth = (req,res,next) => {
    let params = req.params;
    adminUserDao.getPaymentFeeByMonth(params,(error,result)=>{
        if (error) {
            logger.error(' getPaymentFeeByMonth ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' getPaymentFeeByMonth ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getCheckCarByMonth = (req,res,next) => {
    let params = req.params;
    adminUserDao.getCheckCarByMonth(params,(error,result)=>{
        if (error) {
            logger.error(' getCheckCarByMonth ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' getCheckCarByMonth ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const getCheckCarByDay = (req,res,next)=>{
    let params = req.params;
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    let myDateSize = myDate.setDate((myDate.getDate()-params.dateSize));
    params.dateIdStart = moment(myDateSize).format('YYYYMMDD');
    adminUserDao.getCheckCarByDay(params,(error,result)=>{
        if(error){
            logger.error('getCheckCarByDay ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getCheckCarByDay ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
module.exports = {
    createAdminUser,
    adminUserLogin,
    getAdminUserInfo,
    updateAdminInfo,
    changeAdminPassword,
    getUserStat,
    getUserCarStat,
    getSuperviseStat,
    getCheckCarStatByMonth,
    getOrderStatByMonth,
    getLogStatByMonth,
    getOrderFeedbackStatByMonth,
    getPaymentFeeByMonth,
    getCheckCarByMonth,
    getCheckCarByDay
}