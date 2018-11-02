'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Courier.js');
const courierDAO = require('../dao/CourierDAO.js');

const addCourier = (req,res,next)=>{
    let params = req.params;
    courierDAO.addCourier(params,(error,result)=>{
        if(error){
            logger.error('addCourier' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addCourier' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const getCourier = (req,res,next)=>{
    let params = req.params;
    courierDAO.getCourier(params,(error,result)=>{
        if(error){
            logger.error('getCourier' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getCourier' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const updateCourier = (req,res,next)=>{
    let params = req.params;
    courierDAO.updateCourier(params,(error,result)=>{
        if(error){
            logger.error('updateCourier' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateCourier' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
module.exports = {
    addCourier,
    getCourier,
    updateCourier
}