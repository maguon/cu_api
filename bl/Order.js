'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('Order.js');
const orderDAO = require('../dao/OrderDAO.js');
const productDAO = require('../dao/ProductDAO.js');
/**
 * productArray [{prodId:1000,num:2,remark:'abc},{prodId:1001,num:1,remark:'dcd'}]
 * insert into order_itemprod_id,prod_name) values (select id,name from product_info where id =1000);
 * @param req
 * @param res
 * @param next
 */
const addOrder = (req,res,next)=>{
    /*let params = req.params;
    new Promise((resolve, reject) => {
        superviseDao.querySupervise(params,(error,rows)=>{
            if(error){
                reject(error);
            }else{
                resolve(rows);
            }
        })
    }).then((result)=>{
        Promise.all(result.map((item)=>{
            new Promise((resolve,reject) =>{
                superviseDao.updateSuperviseStatus({superviseId:item.id,status:1},(error,result)=>{
                    if(error){
                        reject(error);
                    }else{
                        resolve(result);
                    }
                })
            }).then((result)=>{
                console.log(result);
            }).catch((error)=>{resUtil.resInternalError(error, res, next);})

        })).then(()=>{
            resUtil.resetQueryRes(res,[],null)
        })
    }).catch((error)=>{
        resUtil.resInternalError(error, res, next);
    })*/
    let params = req.params;
    let rowsLength = 0;
    let totalPrice = 0;
    let prodCount = 0;
    let totalFreight = 0;
    let orderId = 0;
    let productIds = {};
    let prodCounts = {};
    let remark = {};
    let carId = {};
    orderDAO.addOrder(params,(error,result)=> {
        if (error) {
            logger.error('addOrder' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('addOrder' + 'success');
            orderId = result.insertId;
            params.orderId = orderId;
            productIds = params.productId;
            prodCounts = params.prodCount;
            remark = params.remark;
            carId = params.carId;
            let p = [{
                bb:2
            }]
            logger.info(p[0].bb);
            for(let i=0;i<productIds.length;i++){
                params.productId = productIds[i];
                params.prodCount = prodCounts[i];
                params.remark = prodCounts[i];
                params.carId = prodCounts[i];
                orderDAO.addOrderItemByProduct(params,(error,result)=>{
                    if(error){
                        logger.error('addOrderItemByProduct' + error.message);
                        resUtil.resInternalError(error, res, next);
                    }else{
                        logger.info('addOrderItemByProduct' + 'success');

                    }
                })
            }
            orderDAO.getOrderItem({orderId:params.orderId},(error,rows)=>{
                if(error){
                    logger.error('getOrderItem' + error.message);
                    resUtil.resInternalError(error, res, next);
                }else if(rows && rows.length<1){
                    logger.warn('getOrderItem' + '没有选择商品');
                    resUtil.resetQueryRes(res,'没有选择商品',null);
                }else{
                    rowsLength = rows.length;
                    for(let i=0;i<rowsLength;i++){
                        totalPrice =  rows[i].total_price + totalPrice;
                        prodCount =  rows[i].prod_count + prodCount;
                        totalFreight = rows[i].freight + totalFreight;
                        params.totalPrice = totalPrice;
                        params.prodCount = prodCount;
                        params.totalFreight = totalFreight;
                    }
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
                }
            })
        }
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
    orderDAO.updateOrderPaymengStatus(params,(error,result)=>{
        if(error){
            logger.error('updateOrderPaymengStatus' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateOrderPaymengStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
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