'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Order.js');
const orderDAO = require('../dao/OrderDAO.js');
const productDAO = require('../dao/ProductDAO.js');

const addOrder = (req,res,next)=>{
    let params = req.params;
    orderDAO.addOrder(params,(error,result)=>{
        if(error){
            logger.error('addOrder' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getOrder' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const addOrderItem = (req,res,next)=>{
    let params = req.params;
    let product = {}
    new Promise((resolve,reject)=>{
        productDAO.getProduct({productId:params.productId},(error,rows)=>{
            if(error){
                logger.error('getProduct' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else if(rows && rows.length<1){
                logger.warn('getProduct' + '没有此商品');
                resUtil.resetQueryRes(res,'没有此商品',null);
            }else{
                 product = {
                    userId: params.userId,
                    orderId: params.orderId,
                    productId: rows[0].id,
                    productName: rows[0].product_name,
                    unitPrice: rows[0].unit_price,
                    prodCount:params.prodCount
                }
                product.totalPrice = product.unitPrice * product.prodCount;
                resolve(product);
            }
        });
    }).then(()=>{
        orderDAO.addOrderItem(product,(error,result)=>{
            if(error){
                logger.error('addOrderItem' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else{
                logger.info('addOrderItem' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}
const updateOrderPrice = (req,res,next)=>{
    let params = req.params;
    let rowsLength = 0;
    let totalPrice = 0;
    let prodCount = 0;
    new Promise((resolve,reject)=>{
        orderDAO.getOrderItem(params,(error,rows)=>{
            if(error){
                logger.error('getOrderItem' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else if(rows && rows.length<1){
                logger.warn('getOrderItem' + '没有选择商品');
                resUtil.resetQueryRes(res,'没有选择商品',null);
            }else{
                rowsLength = rows.length;
                for(let i=0;i<rowsLength;i++){
                    totalPrice =  rows[i].total_price + totalPrice,
                    prodCount =  rows[i].prod_count + prodCount
                }
                resolve();
            }
        })
    }).then(()=>{
        params.totalPrice = totalPrice;
        params.prodCount = prodCount;
        orderDAO.updateOrderPrice(params,(error,result)=>{
            if(error){
                logger.error('updateOrderPrice' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else{
                logger.info('updateOrderPrice' + 'success');
                resUtil.resetUpdateRes(res,result,null);
                return next();
            }
        });
    })
}
const getOrder = (req,res,next)=>{
    let params = req.params;
    orderDAO.getOrder(params,(error,result)=>{
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
const delOrderItem = (req,res,next)=>{
    let params = req.params;
    orderDAO.delOrderItem(params,(error,result)=>{
        if(error){
            logger.error('delOrderItem' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('delOrderItem' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateOrderStatus = (req,res,next)=>{
    let params = req.params;
    orderDAO.updateOrderStatus(params,(error,result)=>{
        if(error){
            logger.error('updateOrderStatus' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateOrderStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
module.exports = {
    addOrder,
    addOrderItem,
    updateOrderPrice,
    getOrder,
    delOrderItem,
    updateOrderStatus
}