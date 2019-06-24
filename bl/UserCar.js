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
            logger.error('queryUserCar ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('queryUserCar ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
const updateUserCar = (req,res,next)=>{
    let params = req.params;
    userCarDao.updateUserCar(params,(error,result)=>{
        if(error){
            logger.error('updateUserCar ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateUserCar ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const addUserCar = (req,res,next)=>{
    let params = req.params;
    userCarDao.queryUserCar({vin:params.vin,licensePlate:params.licensePlate,status:0},(error,rows)=>{
        if(error){
            logger.error('addUserCar queryUserCar ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else if(rows && rows.length > 0){
            userCarDao.updateUserCarByVin({vin:params.vin,licensePlate:params.licensePlate,status:1,userId:params.userId},(error,result)=>{
                if(error){
                    logger.error('addUserCar updateUserCarByVin ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    logger.info('addUserCar updateUserCarByVin ' + 'success');
                    resUtil.resetCreateRes(res,result,null);
                    return next();
                }
            })
        }else{
            userCarDao.queryUserCar({vin:params.vin,status:1},(error,rows)=>{
                if(error){
                    logger.error('addUserCar userCar_queryUserCar ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else if(rows && rows.length > 0){
                    logger.warn('addUserCar userCar_queryUserCar ' + 'The vehicle identification number has been bound.');
                    resUtil.resetFailedRes(res,'该车辆识别码已经被绑定',null);
                }else{
                    logger.info('addUserCar userCar_queryUserCar '+'success');
                    userCarDao.queryUserCar({licensePlate:params.licensePlate,status:1},(error,rows)=>{
                        if(error){
                            logger.error('addUserCar userCar_queryUserCar_license ' + error.message);
                            resUtil.resInternalError(error, res, next);
                        }else if(rows && rows.length > 0){
                            logger.warn('addUserCar userCar_queryUserCar_license ' + 'The license plate has been bound.');
                            resUtil.resetFailedRes(res,'该车牌已经被绑定',null);
                        }else{
                            userCarDao.addUserCar(params,(error,result)=>{
                                if(error){
                                    logger.error('addUserCar userCar_addUserCar ' + error.message);
                                    resUtil.resInternalError(error, res, next);
                                }else{
                                    userCarDao.getUserCarNum(params,(error,rows)=>{
                                        if(error){
                                            logger.error('addUserCar getUserCarNum ' + error.message);
                                            resUtil.resInternalError(error, res, next);
                                        }else{
                                            let num = rows[0].num + 1 ;
                                            params.num = num;
                                            userCarDao.updateUserCarNum(params,(error,result));
                                            logger.info('addUserCar getUserCarNum ' + 'success');
                                            resUtil.resetCreateRes(res,result,null);
                                            return next();
                                        }
                                    })
                                }
                            });
                        }
                    })
                }
            })
        }
    })
};
const delUserCar = (req,res,next)=>{
    let params = req.params;
    userCarDao.delUserCar(params,(error,result)=>{
        if(error){
            logger.error('delUserCar userCar_delUserCar ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            userCarDao.getUserCarNum(params,(error,rows)=>{
                if(error){
                    logger.error('delUserCar getUserCarNum ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    logger.info('delUserCar getUserCarNum ' + 'success');
                    let num = rows[0].num - 1 ;
                    params.num = num;
                    userCarDao.updateUserCarNum(params,(error,result));
                }
            })
            logger.info('delUserCar addUsuserCar_delUserCarerCar ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const updateUserCarStatus = (req,res,next)=>{
    let params = req.params;
    userCarDao.updateUserCarStatus(params,(error,result)=>{
        if(error){
            logger.error('updateUserCarStatus ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            userCarDao.getUserCarNum(params,(error,rows)=>{
                if(error){
                    logger.error('updateUserCarStatus getUserCarNum ' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    logger.info('updateUserCarStatus getUserCarNum ' + 'success');
                    let num = rows[0].num - 1 ;
                    params.num = num;
                    userCarDao.updateUserCarNum(params,(error,result));
                }
            })
            logger.info('updateUserCarStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
module.exports = {
    queryUserCar,
    updateUserCar,
    addUserCar,
    delUserCar,
    updateUserCarStatus
}