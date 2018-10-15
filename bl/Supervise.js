'use strict';

const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const encrypt = require('../util/Encrypt.js');
const resUtil = require('../util/ResponseUtil.js');
const listOfValue = require('../util/ListOfValue.js');
const oAuthUtil = require('../util/OAuthUtil.js');
const superviseDao = require('../dao/SuperviseDAO.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('Supervise.js');
const moment = require('moment/moment.js');

const createSupervise = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject)=>{
        superviseDao.querySupervise({phone:params.phone},(error,rows)=>{
            if (error) {
                logger.error(' querySupervise ' + error.message);
                resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG) ;
                return next();
            } else {
                if(rows && rows.length>0){
                    logger.warn(' querySupervise ' +params.phone+ sysMsg.CUST_SIGNUP_REGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.CUST_SIGNUP_REGISTERED) ;
                    return next();
                }else{
                    resolve();
                }
            }
        })
    }).then(()=>{
        params.password = encrypt.encryptByMd5(params.password);
        superviseDao.createSupervise(params,(error,result)=>{
            if (error) {
                logger.error(' createSupervise ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(result && result.insertId>0){
                    logger.info(' createSupervise ' + 'success');
                    let user = {
                        userId : result.insertId,
                        userStatus : listOfValue.USER_STATUS_ACTIVE
                    }
                    user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.user,user.userId,user.userStatus);
                    resUtil.resetQueryRes(res,user,null);
                }else{
                    logger.warn(' createSupervise ' + 'false');
                    resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
                return next();
            }
        })
    })
}
const superviseLogin = (req,res,next) =>{
    let params = req.params;
    superviseDao.querySupervise({phone:params.phone},(error,rows)=>{
        if (error) {
            logger.error(' querySupervise ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            if(rows && rows.length<1){
                logger.warn(' querySupervise ' +params.phone+ sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED) ;
                return next();
            }else{
                let passwordMd5 = encrypt.encryptByMd5(params.password);
                if(passwordMd5 != rows[0].password){
                    logger.warn(' querySupervise ' +params.phone+ sysMsg.CUST_LOGIN_PSWD_ERROR);
                    resUtil.resetFailedRes(res,sysMsg.CUST_LOGIN_PSWD_ERROR) ;
                    return next();
                }else{
                    if(rows[0].status == listOfValue.ADMIN_USER_STATUS_NOT_ACTIVE){
                        let user = {
                            userId : rows[0].id,
                            userStatus : rows[0].status
                        }
                        logger.info('querySupervise' +params.userName+ " not verified");
                        resUtil.resetQueryRes(res,user,null);
                        return next();
                    }else{
                        let user = {
                            userId : rows[0].id,
                            userStatus : rows[0].status
                        }
                        user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.admin,user.userId,user.userStatus);
                        logger.info('querySupervise' +params.userName+ " success");
                        resUtil.resetQueryRes(res,user,null);
                        return next();
                    }
                }
            }
        }
    })
}
const querySupervise = (req,res,next) => {
    let params = req.params;
    superviseDao.querySupervise(params,(error,rows)=>{
        if (error) {
            logger.error(' querySupervise ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySupervise ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
const getSuperviseInfo = (req,res,next) => {
    let params = req.params;
    let myDate = new Date();
    let strDate = moment(myDate).format('YYYYMMDD');
    params.createdDateId = parseInt(strDate);
    superviseDao.getSuperviseInfo(params,(error,rows)=>{
        if (error) {
            logger.error(' getSuperviseInfo ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' getSuperviseInfo ' + 'success');
            resUtil.resetQueryRes(res,rows,null);
            return next();
        }
    })
}
const updateSuperviseInfo = (req,res,next) => {
    let params = req.params;
    superviseDao.updateInfo(params,(error,result)=>{
        if (error) {
            logger.error(' updateInfo ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateInfo ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const changeSupervisePassword = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject) => {
        superviseDao.querySupervise(params,(error,rows)=>{
            if (error) {
                logger.error(' querySupervise ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(rows && rows.length<1){
                    logger.warn(' querySupervise ' + sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    return next();
                }else if(encrypt.encryptByMd5(params.originPassword) != rows[0].password){
                    logger.warn(' querySupervise ' + sysMsg.CUST_ORIGIN_PSWD_ERROR);
                    resUtil.resetFailedRes(res,sysMsg.CUST_ORIGIN_PSWD_ERROR);
                    return next();
                }else{
                    resolve();
                }
            }
        })
    }).then(() => {
        params.password = encrypt.encryptByMd5(params.newPassword);
        superviseDao.updatePassword(params,(error,result)=>{
            if (error) {
                logger.error(' updatePassword ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                logger.info(' updatePassword ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}
const changeSupervisePhone = (req,res,next) => {
    let params = req.params;
    oAuthUtil.getSignCode({phone:params.phone},(error,result)=>{
        if(error){
            logger.error(' sendPswdSms ' + error.message);
            resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
            return next();
        }else{
            if(result.result.code==params.signCode){
                superviseDao.updatePhone(params,(error,result)=>{
                    if(error){
                        logger.error('updatePhone' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }else{
                        logger.info('updatePhone' + 'success');
                        resUtil.resetUpdateRes(res,result,null);
                        return next();
                    }
                })
            }else{
                logger.warn('getSignCode' + '验证失败');
                resUtil.resetFailedRes(res,'验证失败',null);
                return next();
            }
        }
    })
}
module.exports = {
    createSupervise,
    superviseLogin,
    querySupervise,
    getSuperviseInfo,
    updateSuperviseInfo,
    changeSupervisePassword,
    changeSupervisePhone
}