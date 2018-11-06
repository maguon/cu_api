'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('PaymentDAO.js');
const paymentDAO = require('../dao/PaymentDAO.js');
const orderDAO = require('../dao/OrderDAO.js');
const wechatDAO =require('../dao/WechatDAO.js');

const addPayment = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=>{
        orderDAO.getOrder(params,(error,rows)=>{
            if(error){
                logger.error('getOrder' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else if(rows && rows.length < 1){
                logger.warn('getOrder '+'查询订单失败');
                resUtil.resetFailedRes(res,'查询订单失败',null);
            }else{
                params.paymentPrice = rows[0].total_price + rows[0].total_freight;
                resolve();
            }
        })
    }).then(()=>{
        paymentDAO.addPayment(params,(error,result)=>{
            if(error){
                logger.error('addPayment' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else if(result && result.insertId < 1){
                logger.warn('addPayment '+'生成支付信息失败');
                resUtil.resetFailedRes(res,'生成支付信息失败',null);
            }else{
                logger.info('addPayment '+'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}
const getPayment = (req,res,next)=>{
    let params = req.params;
    paymentDAO.getPayment(params,(error,result)=>{
        if(error){
            logger.error('getPayment' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getPayment' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const updateStatus = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=>{
        wechatDAO.unifiedOrder(params,(error,rows)=>{
            if(error){
                logger.error('unifiedOrder' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else if(rows&& rows.length<1){
                logger.warn('unifiedOrder '+'支付失败');
                resUtil.resetFailedRes(res,'支付失败',null);
            }else{
                let paramsUnifiedOrder = {
                    rows
                }
            }
        })
    }).then(()=>{
        paymentDAO.updateStatus(params,(error,result)=>{
            if(error){
                logger.error('updateStatus' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else{
                logger.info('updateStatus' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        });
    })
}
module.exports = {
    addPayment,
    getPayment,
    updateStatus
}