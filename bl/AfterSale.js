'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('AfterSale.js');
const afterSaleDAO = require('../dao/AfterSaleDAO.js');

const addAfterSale = (req,res,next)=>{
    let params = req.params;
    afterSaleDAO.addAfterSale(params,(error,result)=>{
        if(error){
            logger.error('addAfterSale' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addAfterSale' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const getAfterSale = (req,res,next)=>{
    let params = req.params;
    afterSaleDAO.getAfterSale(params,(error,result)=>{
        if(error){
            logger.error('getAfterSale' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getAfterSale' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const updateAfterSalePayment = (req,res,next)=>{
    let params = req.params;
    afterSaleDAO.updateAfterSalePayment(params,(error,result)=>{
        if(error){
            logger.error('updateAfterSalePayment' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateAfterSalePayment' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateAfterSaleCount = (req,res,next)=>{
    let params = req.params;
    afterSaleDAO.updateAfterSaleCount(params,(error,result)=>{
        if(error){
            logger.error('updateAfterSaleCount' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateAfterSaleCount' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateAfterSaleRemark = (req,res,next)=>{
    let params = req.params;
    afterSaleDAO.updateAfterSaleRemark(params,(error,result)=>{
        if(error){
            logger.error('updateAfterSaleRemark' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateAfterSaleRemark' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateAfterSaleStatus = (req,res,next)=>{
    let params = req.params;
    afterSaleDAO.updateAfterSaleStatus(params,(error,result)=>{
        if(error){
            logger.error('updateAfterSaleStatus' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateAfterSaleStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
module.exports = {
    addAfterSale,
    getAfterSale,
    updateAfterSalePayment,
    updateAfterSaleCount,
    updateAfterSaleRemark,
    updateAfterSaleStatus
}