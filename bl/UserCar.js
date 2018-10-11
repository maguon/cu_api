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
const updatePaperRemark = (req,res,next)=>{
    let params = req.params;
    userCarDao.updatePaperRemark(params,(error,result)=>{
        if(error){
            logger.error('updatePaperRemark' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updatePaperRemark' + 'success');
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
module.exports = {
    queryUserCar,
    updatePaperRemark,
    addUserCar
}