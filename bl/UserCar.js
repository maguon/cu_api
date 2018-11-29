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
            resUtil.resInternalError(error, res, next);
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
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateUserCar' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const addUserCar = (req,res,next)=>{
    let params = req.params;
    userCarDao.queryUserCar({vin:params.vin,licensePlate:params.licensePlate,status:0},(error,rows)=>{
        if(error){
            logger.error('queryUserCar' + error.message);
            resUtil.resInternalError(error, res, next);
        }else if(rows && rows.length > 0){
            userCarDao.updateUserCarByVin({vin:params.vin,licensePlate:params.licensePlate,status:1,userId:params.userId},(error,result)=>{
                if(error){
                    logger.error('updateUserCar' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    logger.info('updateUserCar' + 'success');
                    resUtil.resetCreateRes(res,result,null);
                    return next();
                }
            })
        }else{
            userCarDao.queryUserCar({vin:params.vin,status:1},(error,rows)=>{
                if(error){
                    logger.error('queryUserCar' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else if(rows && rows.length > 0){
                    logger.warn('queryUserCar' + '该车辆识别码已经被绑定');
                    resUtil.resetFailedRes(res,'该车辆识别码已经被绑定',null);
                }else{
                    logger.info('queryUserCar'+'success');
                    userCarDao.queryUserCar({licensePlate:params.licensePlate,status:1},(error,rows)=>{
                        if(error){
                            logger.error('queryUserCar' + error.message);
                            resUtil.resInternalError(error, res, next);
                        }else if(rows && rows.length > 0){
                            logger.warn('queryUserCar' + '该车牌已经被绑定');
                            resUtil.resetFailedRes(res,'该车牌已经被绑定',null);
                        }else{
                            userCarDao.addUserCar(params,(error,result)=>{
                                if(error){
                                    logger.error('addUserCar' + error.message);
                                    resUtil.resInternalError(error, res, next);
                                }else{
                                    userCarDao.getUserCarNum(params,(error,rows)=>{
                                        if(error){
                                            logger.error('getUserCarNum' + error.message);
                                            resUtil.resInternalError(error, res, next);
                                        }else{
                                            let num = rows[0].num + 1 ;
                                            params.num = num;
                                            userCarDao.updateUserCarNum(params,(error,result));
                                            logger.info('addUserCar' + 'success');
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
            logger.error('delUserCar' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            userCarDao.getUserCarNum(params,(error,rows)=>{
                if(error){
                    logger.error('getUserCarNum' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    let num = rows[0].num - 1 ;
                    params.num = num;
                    userCarDao.updateUserCarNum(params,(error,result));
                }
            })
            logger.info('addUserCar' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const updateUserCarStatus = (req,res,next)=>{
    let params = req.params;
    userCarDao.updateUserCarStatus(params,(error,result)=>{
        if(error){
            logger.error('updateUserCarStatus' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            userCarDao.getUserCarNum(params,(error,rows)=>{
                if(error){
                    logger.error('getUserCarNum' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else{
                    let num = rows[0].num - 1 ;
                    params.num = num;
                    userCarDao.updateUserCarNum(params,(error,result));
                }
            })
            logger.info('updateUserCarStatus' + 'success');
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