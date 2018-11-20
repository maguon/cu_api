'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addOrder = (params,callback) => {
    let query = "insert into order_info(user_id) values(?)";
    let paramsArray = [],i=0;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addOrder');
        callback(error,rows);
    })
}
const addOrderItem = (params,callback) => {
    let query = "insert into order_item(imag,remark,car_id,freight,user_id,order_id,product_id,product_name,unit_price,prod_count,total_price)values(?,?,?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.imag;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.carId;
    paramsArray[i++] = params.freight;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.productId;
    paramsArray[i++] = params.productName;
    paramsArray[i++] = params.unitPrice;
    paramsArray[i++] = params.prodCount;
    paramsArray[i] = params.totalPrice;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addOrderItem');
        callback(error,rows);
    })
}
const getOrder = (params,callback) => {
    let query = " select oi.user_id,oi.updated_on,oi.remark,oi.recv_name,oi.recv_phone,oi.recv_address,oi.order_name,ui.wechat_name,oi.id,oi.order_name,oi.prod_count,oi.total_freight,oi.total_price,ui.user_name,ui.phone,oi.created_on,oi.payment_status,oi.log_status,oi.status from order_info oi " +
                " left join user_info ui on ui.id=oi.user_id " +
                " where oi.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and oi.user_id =? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and oi.id =? ";
    }
    if(params.orderName){
        paramsArray[i++] = params.orderName;
        query = query + " and oi.order_name =? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name =? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone =? ";
    }
    if(params.logStatus){
        paramsArray[i++] = params.logStatus;
        query = query + " and oi.log_status =? ";
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and oi.payment_status =? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart+" 00:00:00";
        query = query + " and oi.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd+" 23:59:59";
        query = query + " and oi.created_on <= ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and oi.status =? ";
    }
    query = query + " order by oi.id asc ";
    if(params.start&&params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrder');
        callback(error,rows);
    })
}
const updateOrderPrice = (params,callback) => {
    let query = " update order_info set order_name=?,total_freight=?,total_price = ?,prod_count = ?,recv_address=?,recv_name=?,recv_phone=?, " +
                " remark=? where user_id=? and id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.orderName;
    paramsArray[i++] = params.totalFreight;
    paramsArray[i++] = params.totalPrice;
    paramsArray[i++] = params.prodCount;
    paramsArray[i++] = params.recvAddress;
    paramsArray[i++] = params.recvName;
    paramsArray[i++] = params.recvPhone;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderPrice');
        callback(error,rows);
    })
}
const getOrderItem = (params,callback) => {
    let query = " select oi.id as order_id,oit.imag,oit.remark,oi.recv_name,oi.recv_phone,oi.recv_address,oit.product_id,oit.product_name,ui.wechat_name,uc.license_plate,oit.id,oi.order_name,oit.prod_count,oit.unit_price,oit.freight,oit.total_price,ui.user_name,ui.phone,oit.created_on,oi.payment_status,oi.log_status from order_item oit " +
                " left join order_info oi on oit.order_id=oi.id " +
                " left join user_info ui on ui.id=oit.user_id " +
                " left join user_car uc on uc.id=oit.car_id " +
                " left join product_info pi on pi.id=oit.product_id " +
                " where oit.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and oit.user_id =? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and oi.id =? ";
    }
    if(params.orderItemId){
        paramsArray[i++] = params.orderItemId;
        query = query + " and oit.id =? ";
    }
    if(params.productId){
        paramsArray[i++] = params.productId;
        query = query + " and oit.product_id =? ";
    }
    if(params.productName){
        paramsArray[i++] = params.productName;
        query = query + " and pi.product_name =? ";
    }
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and uc.id =? ";
    }
    if(params.orderName){
        paramsArray[i++] = params.orderName;
        query = query + " and oi.order_name =? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name =? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone =? ";
    }
    if(params.logStatus){
        paramsArray[i++] = params.logStatus;
        query = query + " and oi.log_status =? ";
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and oi.payment_status =? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart+" 00:00:00 ";
        query = query + " and oit.created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd+" 23:59:59 ";
        query = query + " and oit.created_on <= ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and oi.status =? ";
    }
    query = query + " order by oit.id asc ";
    if(params.start&&params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrderItem');
        callback(error,rows);
    })
}
const delOrderItem = (params,callback) => {
    let query = "delete from order_item where user_id=? and id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.orderItemId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('delOrderItem');
        callback(error,rows);
    })
}
const updateOrderStatus = (params,callback) => {
    let query = "update order_info set status = ? where user_id=? and id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderStatus');
        callback(error,rows);
    })
}
const updateOrderLogStatus = (params,callback) => {
    let query = "update order_info set log_status = ? where user_id=? and id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.logStatus;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderLogStatus');
        callback(error,rows);
    })
}
const updateOrderPaymengStatus = (params,callback) => {
    let query = "update order_info set payment_status = ? where user_id=? and id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.paymentStatus;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderPaymengStatus');
        callback(error,rows);
    })
}
const addOrderItemByProduct = (params,callback) => {
    let query = " insert into order_item " +
                " (remark,car_id,freight,user_id,order_id,product_id,product_name,unit_price,prod_count,total_price) " +
                " select ?,?,1*freight ,?,?,id,product_name,unit_price,?,?*unit_price+1*freight from product_info where id =? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.carId;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.count;
    paramsArray[i++] = params.count;
    paramsArray[i] = params.productId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addOrderItemByProduct');
        callback(error,rows);
    })
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
    updateOrderPaymengStatus,
    addOrderItemByProduct
}