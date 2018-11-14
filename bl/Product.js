'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Product.js');
const productDAO = require('../dao/ProductDAO.js');

const addProduct = (req,res,next)=>{
    let params = req.params;
    productDAO.addProduct(params,(error,result)=>{
        if(error){
            logger.error('addProduct' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addProduct' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const getProduct = (req,res,next)=>{
    let params = req.params;
    productDAO.getProduct(params,(error,result)=>{
        if(error){
            logger.error('getProduct' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getProduct' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const updateStatus = (req,res,next)=>{
    let params = req.params;
    productDAO.updateStatus(params,(error,result)=>{
        if(error){
            logger.error('updateStatus' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateImg = (req,res,next)=>{
    let params = req.params;
    productDAO.updateImg(params,(error,result)=>{
        if(error){
            logger.error('updateImg' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateImg' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateProductRemark = (req,res,next)=>{
    let params = req.params;
    productDAO.updateProductRemark(params,(error,result)=>{
        if(error){
            logger.error('updateProductRemark' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateProductRemark' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateProductInfo = (req,res,next)=>{
    let params = req.params;
    productDAO.updateProductInfo(params,(error,result)=>{
        if(error){
            logger.error('updateProductInfo' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateProductInfo' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
module.exports = {
    addProduct,
    getProduct,
    updateStatus,
    updateProductInfo,
    updateImg,
    updateProductRemark
}