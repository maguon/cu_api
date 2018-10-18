'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('UserCar.js');
const userCarDao = require('../dao/UserCarDAO.js');

const queryUserCar = (req,res,next)=>{
    let params = req.params;
    userCarDao.queryUserCar(params,(error,result)=>{
        if(error){
            logger.error('queryUserCar' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('queryUserCar' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
const updateUserCar = (req,res,next)=>{
    let params = req.params;
    userCarDao.updateUserCar(params,(error,result)=>{
        if(error){
            logger.error('updateUserCar' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateUserCar' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const addUserCar = (req,res,next)=>{
    let params = req.params;
    userCarDao.addUserCar(params,(error,result)=>{
        if(error){
            logger.error('addUserCar' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addUserCar' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
};
const delUserCar = (req,res,next)=>{
    let params = req.params;
    userCarDao.delUserCar(params,(error,result)=>{
        if(error){
            logger.error('delUserCar' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('delUserCar' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const queryUserCarNumById = (req,res,next)=>{
    let params = req.params;
    userCarDao.queryUserCarNumById(params,(error,result)=>{
        if(error){
            logger.error('queryUserCarNumById' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('queryUserCarNumById' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
module.exports = {
    queryUserCar,
    updateUserCar,
    addUserCar,
    delUserCar,
    queryUserCarNumById
}