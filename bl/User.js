'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('User.js');
const userDao = require('../dao/UserInfoDAO.js');
const encrypt = require('../util/Encrypt.js');
const oauthUtil = require('../util/OAuthUtil.js');

const updateUser = (req,res,next)=>{
    let params = req.params;
    userDao.updateUser(params,(error,result)=>{
        if(error){
            logger.error('updateUser' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateUser' + 'success');
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
                logger.error('updatePassword' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else if(rows && rows.length < 1){
                logger.warn('updatePassword' + "尚未注册");
                resUtil.resetFailedRes(res,"尚未注册");
                return next();
            }else if(encrypt.encryptByMd5(params.oldPassword) != rows[0].password){
                logger.warn('updatePassword' + "原密码错");
                resUtil.resetFailedRes(res,"原密码错误");
                return next();
            }else{
                resolve();
            }
        })
    }).then(() => {
        params.newPassword = encrypt.encryptByMd5(params.newPassword);
        userDao.updatePassword(params,(error,result)=>{
            if(error){
                logger.error('updatePassword' + error.message);
                throw sysError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else{
                logger.info('updatePassword' + 'success');
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
            logger.error('updateStatus' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            if(params.wechatStatus==1){
                let myDate = new Date();
                params.myDate = myDate;
                userDao.updateCreatedTime(params,(error,result));
            }
            logger.info('updateStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const updateType=(req,res,next)=>{
    let params = req.params;
    userDao.updateType(params,(error,result)=>{
        if(error){
            logger.error('updateType' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            if(params.authStatus==1){
                let myDate = new Date();
                params.myDate = myDate;
                userDao.updateAuthTime(params,(error,result));
            }
            logger.info('updateType' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const updatePhone=(req,res,next)=>{
    let params = req.params;
    oauthUtil.getSignCode({phone:params.phone},(error,result)=>{
        if(error){
            logger.error(' sendPswdSms ' + error.message);
            resUtil.resetFailedRes(res,sysMsg.SYS_INTERNAL_ERROR_MSG);
            return next();
        }else{
            if(result.result.code==params.signCode){
                userDao.updatePhone(params,(error,result)=>{
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
const queryUser = (req,res,next)=>{
    let params = req.params;
    userDao.queryUser(params,(error,result)=>{
        if(error){
            logger.error('queryUser' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('queryUser' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
const userLogin = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve)=>{
        userDao.queryUser({wechatId:params.wechatId},(error,rows)=>{
            if(error){
                logger.error('userLogin'+error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else {
                if(rows && rows.length < 1){
                    params.password = encrypt.encryptByMd5(params.password);
                    resolve(params.password);
                }else{
                    let resObj ={
                        userId: rows[0].id,
                        wechatName:rows[0].wechat_name,
                        wechatId: rows[0].wechat_id
                    };
                    resUtil.resetQueryRes(res,resObj,null);
                    var myDate = new Date();
                    params.lastLoginOn = myDate;
                    userDao.lastLoginOn({wechatId:params.wechatId,lastLoginOn:params.lastLoginOn},(error,rows));
                    return next();
                }
            }
        })
    }).then(()=>{
        userDao.createUser(params,(error,result)=>{
            if(error) {
                logger.error('createUser' + error.message);
                throw sysError.InternalError(error.message, sysMsg.SYS_INTERNAL_ERROR_MSG);
            }
            else{
                logger.info('create' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        });
    })
};
module.exports ={
    queryUser,
    userLogin,
    updateUser,
    updatePassword,
    updateStatus,
    updatePhone,
    updateType
};