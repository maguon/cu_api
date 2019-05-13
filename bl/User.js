'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('User.js');
const userDao = require('../dao/UserInfoDAO.js');
const encrypt = require('../util/Encrypt.js');
const oauthUtil = require('../util/OAuthUtil.js');
const moment = require('moment/moment.js');
const sysConfig = require('../config/SystemConfig.js');

const updateUser = (req,res,next)=>{
    let params = req.params;
    userDao.updateUser(params,(error,result)=>{
        if(error){
            logger.error('updateUser ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateUser ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const updatePassword=(req,res,next)=>{
    let params = req.params;
    new Promise((resolve) => {
        userDao.queryUser(params,(error,rows)=>{
            if(error){
                logger.error('updatePassword queryUser ' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                if(rows && rows.length < 1){
                    logger.warn('updatePassword queryUser ' + "Have not yet registered.");
                    resUtil.resetFailedRes(res,"尚未注册");
                    return next();
                }else{
                    if(encrypt.encryptByMd5(params.oldPassword) != rows[0].password){
                        logger.warn('updatePassword queryUser ' + "The original password is wrong.");
                        resUtil.resetFailedRes(res,"原密码错误");
                        return next();
                    }else{
                        logger.info('updatePassword queryUser ' + 'success');
                        resolve();
                    }
                }
            }
        })
    }).then(() => {
        params.newPassword = encrypt.encryptByMd5(params.newPassword);
        userDao.updatePassword(params,(error,result)=>{
            if(error){
                logger.error('updatePassword user_update ' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('updatePassword user_update ' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        })
    })
}
const updateStatus=(req,res,next)=>{
    let params = req.params;
    userDao.updateStatus(params,(error,result)=>{
        if(error){
            logger.error('updateStatus ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            if(params.wechatStatus==1){
                let myDate = new Date();
                params.myDate = myDate;
                userDao.updateCreatedTime(params,(error,result));
            }
            logger.info('updateStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const updateType=(req,res,next)=>{
    let params = req.params;
    userDao.updateType(params,(error,result)=>{
        if(error){
            logger.error('updateType ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            if(params.authStatus==1){
                let myDate = new Date();
                params.myDate = myDate;
                userDao.updateAuthTime(params,(error,result));
            }
            logger.info('updateType ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const updatePhone=(req,res,next)=>{
    let params = req.params;
    oauthUtil.getUserPhoneCode({phone:params.phone},(error,result)=>{
        if(error){
            logger.error('updatePhone getUserPhoneCode ' + error.message);
            resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
            return next();
        }else{
            if(result.result.code==params.signCode){
                let myDate = new Date();
                params.myDate = myDate;
                params.authStatus = 1;
                userDao.updatePhone(params,(error,result)=>{
                    if(error){
                        logger.error('updatePhone user_update ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    }else{
                        logger.info('updatePhone user_update ' + 'success');
                        resUtil.resetUpdateRes(res,result,null);
                        return next();
                    }
                })
            }else{
                logger.warn('updatePhone getUserPhoneCode ' + 'Verification code error.');
                resUtil.resetFailedRes(res,'验证码错误',null);
                return next();
            }
        }
    })
}
const queryUser = (req,res,next)=>{
    let params = req.params;
    userDao.queryUser(params,(error,result)=>{
        if(error){
            logger.error('queryUser ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('queryUser ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
const userLogin = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=>{
        userDao.queryUser({wechatId:params.wechatId},(error,rows)=>{
            if(error){
                logger.error('userLogin queryUser '+error.message);
                reject(error);
            }else{
                logger.info('userLogin queryUser ' + 'success');
                if(rows && rows.length < 1){
                    logger.info("userLogin userInfoRows "+rows[0]);
                    resolve(params);
                }else{
                    let user ={
                        userId: rows[0].id,
                        wechatName:rows[0].wechat_name,
                        wechatId: rows[0].wechat_id,
                        userStatus: rows[0].status
                    };
                    let myDate = new Date();
                    params.lastLoginOn = myDate;
                    user.lastLoginOn = params.lastLoginOn;
                    userDao.lastLoginOn({wechatId:params.wechatId,lastLoginOn:params.lastLoginOn},(error,rows));
                    user.accessToken = oauthUtil.createAccessToken(oauthUtil.clientType.user,user.userId,user.userStatus);
                    resUtil.resetQueryRes(res,user,null);
                    return next();
                }
            }
        })
    }).then((params)=>{
        let myDate = new Date();
        params.dateId = moment(myDate).format('YYYYMMDD');
        if(params.wechatId != null && params.wechatId != ''){
            params.authTime = null;
            if(params.gender && params.gender==2){
                params.gender = 0;
            }
            userDao.createUser(params,(error,result)=>{
                if(error){
                    logger.error('userLogin createUser ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }
                else{
                    params.userId = result.insertId;
                    userDao.queryUser({userId:params.userId},(error,rows)=>{
                        if(error){
                            logger.error('userLogin createUser queryUser '+error.message);
                            resUtil.resInternalError(error, res, next);
                        }else{
                            logger.info('userLogin createUser queryUser ' + 'success');
                            if(rows && rows.length < 1){
                                logger.warn("userLogin createUser queryUser "+"User creation failed.");
                                resUtil.resetFailedRes(res,'创建用户失败',null);
                            }else{
                                let user ={
                                    userId: rows[0].id,
                                    wechatName:rows[0].wechat_name,
                                    wechatId: rows[0].wechat_id,
                                    userStatus: rows[0].status
                                };
                                let myDate = new Date();
                                params.lastLoginOn = myDate;
                                user.lastLoginOn = params.lastLoginOn;
                                userDao.lastLoginOn({wechatId:params.wechatId,lastLoginOn:params.lastLoginOn},(error,rows));
                                user.accessToken = oauthUtil.createAccessToken(oauthUtil.clientType.user,user.userId,user.userStatus);
                                resUtil.resetQueryRes(res,user,null);
                                return next();
                            }
                        }
                    })
                }
            });
        }
    }).catch((error)=>{
        resUtil.resInternalError(error,res,next);
    })
};
const getUserStatByDay = (req,res,next)=>{
    let params = req.params;
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    let myDateSize = myDate.setDate(myDate.getDate()-params.dateSize);
    params.dateIdStart = moment(myDateSize).format('YYYYMMDD');
    userDao.getUserStatByDay(params,(error,result)=>{
        if(error){
            logger.error('getUserStatByDay ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getUserStatByDay ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
const getUserStatByMonth = (req,res,next)=>{
    let params = req.params;
    userDao.getUserStatByMonth(params,(error,result)=>{
        if(error){
            logger.error('getUserStatByMonth ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getUserStatByMonth ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
const getWXBizDataCrypt = (req,res,next)=>{
    let params = req.params;
    let date = encrypt.WXBizDataCrypt(sysConfig.wechatConfig.mpAppId,params.sessionKey,params.encryptedData,params.iv);
    let myDate = new Date();
    logger.info("getWXBizDataCrypt WXBizDataCrypt "+date);
    userDao.queryUser({userId:params.userId},(error,rows)=>{
        if(error){
            logger.error('getWXBizDataCrypt queryUser ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else if(rows && rows.length < 1){
            logger.warn('getWXBizDataCrypt queryUser ' + 'There is no such user.');
            resUtil.resetFailedRes(res,'m查无此用户',null);
        }else{
            if(rows[0].phone && rows[0].phone !== date.purePhoneNumber){
                userDao.updatePhone({userId:params.userId,phone:date.purePhoneNumber,authStatus:1,myDate:myDate},(error,result)=>{
                    if(error){
                        logger.error('getWXBizDataCrypt updatePhone ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    }else{
                        logger.info('getWXBizDataCrypt updatePhone ' + 'success');
                        resUtil.resetUpdateRes(res,result,null);
                        return next();
                    }
                })
            }else if(rows[0].phone == null || rows[0].phone == ''){
                userDao.updatePhone({userId:params.userId,phone:date.purePhoneNumber,authStatus:1,myDate:myDate},(error,result)=>{
                    if(error){
                        logger.error('getWXBizDataCrypt updateNullPhone ' + error.message);
                        resUtil.resInternalError(error, res, next);
                    }else{
                        logger.info('getWXBizDataCrypt updateNullPhone ' + 'success');
                        resUtil.resetUpdateRes(res,result,null);
                        return next();
                    }
                })
            }else{
                logger.info(rows[0].wechat_name +' This user is an old user and can log in directly.');
                resUtil.resetQueryRes(res,{success:true},null);
                return next();
            }
        }
    })
};
const updateUserImg = (req,res,next)=>{
    let params = req.params;
    userDao.updateUserImg(params,(error,result)=>{
        if(error){
            logger.error('updateUserImg ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateUserImg ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
module.exports ={
    queryUser,
    userLogin,
    updateUser,
    updatePassword,
    updateStatus,
    updatePhone,
    updateType,
    getUserStatByDay,
    getUserStatByMonth,
    getWXBizDataCrypt,
    updateUserImg
};