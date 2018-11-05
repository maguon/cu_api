'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('OrderFeedback.js');
const orderFeedbackDAO = require('../dao/OrderFeedbackDAO.js');

const addOrderFeedback = (req,res,next)=>{
    let params = req.params;
    orderFeedbackDAO.addOrderFeedback(params,(error,result)=>{
        if(error){
            logger.error('addOrderFeedback' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addOrderFeedback' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const getOrderFeedback = (req,res,next)=>{
    let params = req.params;
    orderFeedbackDAO.getOrderFeedback(params,(error,result)=>{
        if(error){
            logger.error('getOrderFeedback' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getOrderFeedback' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const updateOrderFeedbackPayment = (req,res,next)=>{
    let params = req.params;
    orderFeedbackDAO.updateOrderFeedbackPayment(params,(error,result)=>{
        if(error){
            logger.error('updateOrderFeedbackPayment' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateOrderFeedbackPayment' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateOrderFeedbackCount = (req,res,next)=>{
    let params = req.params;
    orderFeedbackDAO.updateOrderFeedbackCount(params,(error,result)=>{
        if(error){
            logger.error('updateOrderFeedbackCount' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateOrderFeedbackCount' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateOrderFeedbackRemark = (req,res,next)=>{
    let params = req.params;
    orderFeedbackDAO.updateOrderFeedbackRemark(params,(error,result)=>{
        if(error){
            logger.error('updateOrderFeedbackRemark' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateOrderFeedbackRemark' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateOrderFeedbackStatus = (req,res,next)=>{
    let params = req.params;
    orderFeedbackDAO.updateOrderFeedbackStatus(params,(error,result)=>{
        if(error){
            logger.error('updateOrderFeedbackStatus' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateOrderFeedbackStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
module.exports = {
    addOrderFeedback,
    getOrderFeedback,
    updateOrderFeedbackPayment,
    updateOrderFeedbackCount,
    updateOrderFeedbackRemark,
    updateOrderFeedbackStatus
}