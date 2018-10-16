'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('UserOrder.js');
const userOrderDAO = require('../dao/UserOrderDAO.js');

const addOrder = (req,res,next)=>{
    let params = req.params;
    userOrderDAO.addOrder(params,(error,result)=>{
        if(error){
            logger.error('addOrder' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addOrder' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const getOrder = (req,res,next)=>{
    let params = req.params;
    userOrderDAO.getOrder(params,(error,result)=>{
        if(error){
            logger.error('getOrder' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getOrder' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
module.exports = {
    addOrder,
    getOrder
}