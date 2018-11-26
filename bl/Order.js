'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Order.js');
const orderDAO = require('../dao/OrderDAO.js');
const productDAO = require('../dao/ProductDAO.js');
const moment = require('moment/moment.js');
const logDAO = require('../dao/LogDAO.js');
/**
 * productArray [{prodId:1000,num:2,remark:'abc},{prodId:1001,num:1,remark:'dcd'}]
 * insert into order_itemprod_id,prod_name) values (select id,name from product_info where id =1000);
 * @param req
 * @param res
 * @param next
 */
const addOrder = (req,res,next)=>{
    let params = req.params;
    let rowsLength = 0;
    let totalPrice = 0;
    let prodCount = 0;
    let totalFreight = 0;
    let orderId = 0;
    let resultOrderId =[{}];
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
new Promise((resolve,reject)=>{
    orderDAO.addOrder(params,(error,result)=> {
        if(error){
            logger.error('addOrder' + error.message);
            reject(error)
        }else{
            resultOrderId = [{orderId: result.insertId}];
            logger.info('addOrder' + 'success');
             orderId = result.insertId;
             params.orderId = orderId;
            resolve();
        }
    });
}).then(()=>{
    new Promise((resolve,reject)=>{
        let productIds = params.productId;
        let prodCounts = params.prodCount;
        let remark = params.remark;
        let carId = params.carId;
        for(let i=0;i<productIds.length;i++){
            params.productId = productIds[i];
            params.count = prodCounts[i];
            params.remark = remark[i];
            params.carId = carId[i];
            orderDAO.addOrderItemByProduct(params,(error,result)=>{
                if(error){
                    logger.error('addOrderItemByProduct' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else if(result && result.insertId < 1){
                    logger.warn('addOrderItemByProduct' +'选择商品失败');
                    resUtil.resetFailedRes(res,'选择商品失败',null);
                    return next();
                }else{
                    logger.info('addOrderItemByProduct' + 'success');
                    resolve();
                }
            })
        }
        setTimeout( ()=>{
            console.log('This will still run1.');
        }, 100);
    }).then(()=>{
        new Promise((resolve,reject)=>{
            setTimeout( ()=>{
                console.log('This will still run2.');
            }, 400);
            orderDAO.getOrderItem({orderId:params.orderId},(error,rows)=> {
                if (error) {
                    logger.error('getOrderItem' + error.message);
                    resUtil.resInternalError(error, res, next);
                } else if (rows && rows.length < 1) {
                    logger.warn('getOrderItem' + '没有选择商品');
                    resUtil.resetQueryRes(res, '没有选择商品', null);
                    return next();
                } else {
                    logger.info('getOrderItem' + 'success');
                    rowsLength = rows.length;
                    for (let i = 0; i < rowsLength; i++) {
                        totalPrice = rows[i].total_price + totalPrice;
                        prodCount = rows[i].prod_count + prodCount;
                        totalFreight = rows[i].freight + totalFreight;
                        params.totalPrice = totalPrice;
                        params.prodCount = prodCount;
                        params.totalFreight = totalFreight;
                    }
                    resolve(params);
                }
            });
        }).then(()=>{
            new Promise((resolve,reject)=>{
                setTimeout( ()=>{
                    console.log('This will still run3.');
                }, 500);
                orderDAO.updateOrderPrice(params,(error,result)=>{
                    if(error){
                        logger.error('updateOrderPrice' + error.message);
                        resUtil.resInternalError(error, res, next);
                    }else{
                        logger.info('updateOrderPrice' + 'success');
                        resUtil.resetQueryRes(res,resultOrderId,null);
                        return next();
                    }
                });
            })
        })
    })
}).catch((error)=>{
    resUtil.resInternalError(error, res, next);
})
}
const addOrderItem = (req,res,next)=>{
    let params = req.params;
    let product = {};
    new Promise((resolve,reject)=>{
        productDAO.getProduct({productId:params.productId},(error,rows)=>{
            if(error){
                logger.error('getProduct' + error.message);
                resUtil.resInternalError(error, res, next);
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
                    prodCount:params.prodCount,
                    remark: params.remark,
                    carId: params.carId,
                    freight: params.freight,
                    imag: params.imag
                 }
                 product.totalPrice = product.unitPrice * product.prodCount;
                 resolve(product);
            }
        });
    }).then(()=>{
        orderDAO.addOrderItem(product,(error,result)=>{
            if(error){
                logger.error('addOrderItem' + error.message);
                resUtil.resInternalError(error, res, next);
            }else{
                logger.info('addOrderItem' + 'success');
                resUtil.resetCreateRes(res,result,null);
                return next();
            }
        })
    })
}
const getOrderItem = (req,res,next)=>{
    let params = req.params;
    orderDAO.getOrderItem(params,(error,result)=>{
        if(error){
            logger.error('getOrderItem' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getOrderItem' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const updateOrderPrice = (req,res,next)=>{
    let params = req.params;
    let rowsLength = 0;
    let totalPrice = 0;
    let prodCount = 0;
    let totalFreight = 0;
    new Promise((resolve,reject)=>{
        orderDAO.getOrderItem(params,(error,rows)=>{
            if(error){
                logger.error('getOrderItem' + error.message);
                resUtil.resInternalError(error, res, next);
            }else if(rows && rows.length<1){
                logger.warn('getOrderItem' + '没有选择商品');
                resUtil.resetQueryRes(res,'没有选择商品',null);
            }else{
                rowsLength = rows.length;
                for(let i=0;i<rowsLength;i++){
                    totalPrice =  rows[i].total_price + totalPrice,
                    prodCount =  rows[i].prod_count + prodCount,
                    totalFreight = rows[i].total_freight + totalFreight
                }
                resolve();
            }
        })
    }).then(()=>{
        params.totalPrice = totalPrice;
        params.prodCount = prodCount;
        params.totalFreight = totalFreight;
        orderDAO.updateOrderPrice(params,(error,result)=>{
            if(error){
                logger.error('updateOrderPrice' + error.message);
                resUtil.resInternalError(error, res, next);
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
            resUtil.resInternalError(error, res, next);
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
            resUtil.resInternalError(error, res, next);
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
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateOrderStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateOrderLogStatus = (req,res,next)=>{
    let params = req.params;
    orderDAO.updateOrderLogStatus(params,(error,result)=>{
        if(error){
            logger.error('updateOrderLogStatus' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateOrderLogStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
const updateOrderPaymengStatus = (req,res,next)=>{
    let params = req.params;
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    orderDAO.updateOrderPaymengStatus(params,(error,result)=>{
        if(error){
            logger.error('updateOrderPaymengStatus' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateOrderPaymengStatus' + 'success');
            orderDAO.getOrder({orderId:params.orderId},(error,rows)=>{
                if(error){
                    logger.error('getOrder' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else if(rows && rows.length < 1){
                    logger.warn('getOrder' + '未查到此订单');
                    resUtil.resetFailedRes(res,'未查到此订单',null);
                }else{
                    params.recvName = rows[0].recv_name;
                    params.recvPhone = rows[0].recv_phone;
                    params.recvAddress = rows[0].recv_address;
                    params.remark = rows[0].remark;
                    params.freight = rows[0].total_freight;
                    logDAO.addLogFeedback(params,(error,result)=>{
                        if(error){
                            logger.error('addLogFeedback' + error.message);
                            resUtil.resInternalError(error, res, next);
                        }else{
                            logger.info('addLogFeedback'+'success');
                            resUtil.resetCreateRes(res,result,null);
                            return next();
                        }
                    })
                }
            })
        }
    });
}
module.exports = {
    addOrder,
    addOrderItem,
    getOrderItem,
    updateOrderPrice,
    getOrder,
    delOrderItem,
    updateOrderStatus,
    updateOrderLogStatus,
    updateOrderPaymengStatus
}