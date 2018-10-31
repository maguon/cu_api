'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addOrder = (params,callback) => {
    let query = "insert into order_info(user_id,order_name)values(?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.orderName;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addOrder');
        callback(error,rows);
    })
}
const addOrderItem = (params,callback) => {
    let query = "insert into order_item(user_id,order_id,product_id,product_name,unit_price,prod_count,total_price)values(?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
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
const getOrderItem = (params,callback) => {
    let query = "select * from order_item where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id =?";
    }
    if(params.orderId){
        paramsArray[i] = params.orderId;
        query = query + " and order_id =?";
    }
    if(params.orderItemId){
        paramsArray[i] = params.orderItemId;
        query = query + " and id =?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrderItem');
        callback(error,rows);
    })
}
const updateOrderPrice = (params,callback) => {
    let query = " update order_info set total_price = ?,prod_count = ?,recv_address=?,recv_name=?,recv_phone=?, " +
                " remark=?,payment_status=?,log_status=?,status=? where user_id=? and id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.totalPrice;
    paramsArray[i++] = params.prodCount;
    paramsArray[i++] = params.recvAddress;
    paramsArray[i++] = params.recvName;
    paramsArray[i++] = params.recvPhone;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.paymentStatus;
    paramsArray[i++] = params.logStatus;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.orderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderPrice');
        callback(error,rows);
    })
}
const getOrder = (params,callback) => {
    let query = "select * from order_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id =? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and id =? ";
    }
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and status =? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrder');
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