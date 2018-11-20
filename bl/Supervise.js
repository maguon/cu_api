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
                    let supervise = {
                        superviseId : result.insertId,
                        status : listOfValue.USER_STATUS_ACTIVE
                    }
                    resUtil.resetQueryRes(res,supervise,null);
                }else{
                    logger.warn(' createSupervise ' + 'false');
                    resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
                }
                return next();
            }
        })
    })
}
// const superviseLogin = (req,res,next) =>{
//     let params = req.params;
//     superviseDao.querySupervise({phone:params.phone},(error,rows)=>{
//         if (error) {
//             logger.error(' querySupervise ' + error.message);
//             throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
//         } else {
//             if(rows && rows.length<1){
//                 logger.warn(' querySupervise ' +params.phone+ sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
//                 resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED) ;
//                 return next();
//             }else{
//                 let passwordMd5 = encrypt.encryptByMd5(params.password);
//                 if(passwordMd5 != rows[0].password){
//                     logger.warn(' querySupervise ' +params.phone+ sysMsg.CUST_LOGIN_PSWD_ERROR);
//                     resUtil.resetFailedRes(res,sysMsg.CUST_LOGIN_PSWD_ERROR) ;
//                     return next();
//                 }else{
//                     if(rows[0].status == listOfValue.ADMIN_USER_STATUS_NOT_ACTIVE){
//                         let user = {
//                             userId : rows[0].id,
//                             userStatus : rows[0].status
//                         }
//                         logger.info('querySupervise' +params.userName+ " not verified");
//                         resUtil.resetQueryRes(res,user,null);
//                         return next();
//                     }else{
//                         let user = {
//                             userId : rows[0].id,
//                             userStatus : rows[0].status
//                         }
//                         user.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.admin,user.userId,user.userStatus);
//                         logger.info('querySupervise' +params.userName+ " success");
//                         resUtil.resetQueryRes(res,user,null);
//                         return next();
//                     }
//                 }
//             }
//         }
//     })
// }
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
const updateSuperviseStatus = (req,res,next) => {
    let params = req.params;
    superviseDao.updateSuperviseStatus(params,(error,result)=>{
        if (error) {
            logger.error(' updateSuperviseStatus ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateSuperviseStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
const changeSupervisePassword = (req,res,next) => {
    let params = req.params;
    new Promise((resolve,reject) => {
        superviseDao.querySupervisePass(params,(error,rows)=>{
            if (error) {
                logger.error(' querySupervisePass ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(rows && rows.length<1){
                    logger.warn(' querySupervisePass ' + sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
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
    oAuthUtil.getSupervisePhoneCode({phone:params.phone},(error,result)=>{
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
const changeSupervisePasswordByPhone = (req,res,next) => {
    let params = req.params;
    oAuthUtil.getSupervisePswdCode({phone:params.phone},(error,result)=>{
        if(error){
            logger.error(' sendPswdSms ' + error.message);
            resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
            return next();
        }else{
            if(result.result.code==params.signCode){
                params.password = encrypt.encryptByMd5(params.password);
                superviseDao.updatePasswordByPhone(params,(error,result)=>{
                    if(error){
                        logger.error('updatePassword' + error.message);
                        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                    }else{
                        logger.info('updatePassword' + 'success');
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

const superviseLogin=(req,res,next)=>{
    let params = req.params;
    let supervise ={};
    let newSuperviseDeviceFlag = true;
    new Promise((resolve,reject)=>{
        params.sa = 0;
        //查询登陆手机是否存在
        superviseDao.querySupervisePass({phone:params.phone},(error,rows)=>{
            if (error) {
                logger.error(' querySupervisePass ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            } else {
                if(rows && rows.length<1){
                    logger.warn(' querySupervisePass ' + params.phone+ sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                    resUtil.resetFailedRes(res,sysMsg.ADMIN_LOGIN_USER_UNREGISTERED) ;
                    return next();
                }else{
                    let passwordMd5 = encrypt.encryptByMd5(params.password);
                    if(passwordMd5 != rows[0].password){
                        logger.warn(' phoneSuperviseLogin ' +params.phone+ sysMsg.CUST_LOGIN_PSWD_ERROR);
                        resUtil.resetFailedRes(res,sysMsg.CUST_LOGIN_PSWD_ERROR) ;
                        return next();
                    }else{
                        supervise = {
                            superviseId : rows[0].id,
                            superviseStatus : rows[0].status,
                            type : rows[0].type,
                            name : rows[0].user_name,
                            phone: params.phone
                        }
                        //手机是否被停用
                        if(rows[0].status == listOfValue.USER_STATUS_NOT_ACTIVE){
                            logger.info('phoneSuperviseLogin' +params.phone+ " not actived");
                            resUtil.resetFailedRes(res,sysMsg.SYS_AUTH_TOKEN_ERROR);
                            return next();
                        }else{
                            supervise.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.supervise,supervise.superviseId,supervise.superviseStatus);
                            oAuthUtil.saveToken(supervise,(error,result)=>{
                                if(error){
                                    logger.error(' phoneSuperviseLogin ' + error.stack);
                                    return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG))
                                }else{
                                    logger.info(' phoneSuperviseLogin' + " success");
                                    resolve();
                                }
                            })
                        }
                    }
                }
            }
        })
    }).then(()=>{
        let that = this;
        params.superviseId= supervise.superviseId;
        superviseDao.getSuperviseDevice(params,(error, rows)=>{
            if (error) {
                logger.error(' getSuperviseDevice ' + error.message);
                resUtil.resetFailedRes(res, sysMsg.SYS_INTERNAL_ERROR_MSG);
                return next();
            } else {
                if (rows && rows.length > 0) {
                    //查询device_token是否存在，存在走update，不存在innsert
                    newSuperviseDeviceFlag = false;
                    that()
                } else {
                    that();
                }
            }
        })
    }).then(()=>{
        let that = this;
        if(newSuperviseDeviceFlag) {
            params.superviseId= supervise.superviseId;
            superviseDao.addSuperviseDevice(params,(error,result)=>{
                if (error) {
                    logger.error(' addSuperviseDevice ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(result&&result.insertId>0){
                        logger.info(' addSuperviseDevice ' + 'success');
                    }else{
                        logger.warn(' addSuperviseDevice ' + 'failed');
                    }
                    that();
                }
            })
        }else{
            let myDate = new Date();
            params.updatedOn = myDate;
            params.superviseId= supervise.superviseId;
            superviseDao.updateSuperviseDevice(params,(error,result)=>{
                if (error) {
                    logger.error(' updateSuperviseDevice ' + error.message);
                    throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if (result && result.affectedRows > 0) {
                        logger.info(' updateSuperviseDevice ' + 'success');
                    } else {
                        logger.warn(' updateSuperviseDevice ' + 'failed');
                    }
                    that();
                }
            })
        }
    }).then(()=>{
        logger.info(' phoneSuperviseLogin' +params.phone+ " success");
        resUtil.resetQueryRes(res,supervise,null);
        return next();
    })
}
const changeSuperviseToken=(req,res,next)=>{
    let params = req.params;
    let tokenObj = oAuthUtil.parseAccessTokenSupervise(params.token);
    if(tokenObj){
        if(params.superviseId==tokenObj.superviseId){
            superviseDao.querySupervise({superviseId:params.superviseId},(error,rows)=>{
                if (error) {
                    logger.error(' querySupervise ' + error.message);
                    throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
                } else {
                    if(rows && rows.length<1){
                        logger.warn(' querySupervise ' + params.superviseId+ sysMsg.ADMIN_LOGIN_USER_UNREGISTERED);
                        resUtil.resetFailedRes(res,sysMsg.CUST_LOGIN_USER_UNREGISTERED) ;
                        return next();
                    }else{
                        let supervise = {
                            superviseId : rows[0].id,
                            superviseStatus : rows[0].status,
                            type : rows[0].type,
                            name : rows[0].user_name,
                            phone: rows[0].phone
                        }
                        supervise.accessToken = oAuthUtil.createAccessToken(oAuthUtil.clientType.supervise,supervise.superviseId,supervise.superviseStatus);
                        oAuthUtil.removeToken({accessToken:params.token},(error,result)=>{
                            if(error) {
                                logger.error(' removeToken ' + error.stack);
                            }
                        })
                        oAuthUtil.saveToken(supervise,(error,result)=>{
                            if(error){
                                logger.error(' saveToken ' + error.stack);
                                return next(sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG))
                            }else{
                                logger.info(' saveToken' +params.superviseId+ " success");
                                resUtil.resetQueryRes(res,supervise,null);
                                return next();
                            }
                        })
                    }
                }
            })
        }else{
            logger.warn(' changeSuperviseToken' +params.superviseId+ " failed");
            resUtil.resetFailedRes(res,sysMsg.SYS_AUTH_TOKEN_ERROR) ;
            return next();
        }
    }else{
        logger.warn(' changeSuperviseToken' +params.superviseId+ " failed");
        resUtil.resetFailedRes(res,sysMsg.SYS_AUTH_TOKEN_ERROR) ;
        return next();
    }
}
const updateSuperviseImg = (req,res,next) => {
    let params = req.params;
    superviseDao.updateSuperviseImg(params,(error,result)=>{
        if (error) {
            logger.error(' updateSuperviseImg ' + error.message);
            resUtil.resInternalError(error, res, next);
        } else {
            logger.info(' updateSuperviseImg ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
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
    changeSupervisePhone,
    updateSuperviseStatus,
    changeSupervisePasswordByPhone,
    changeSuperviseToken,
    updateSuperviseImg
}