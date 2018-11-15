'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('PaymentDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addPayment = (params,callback) => {
    let query = " insert into payment_info (user_id,order_id,payment_price,type,payment_type,remark) values(?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.paymentPrice;
    paramsArray[i++] = params.type;
    paramsArray[i++] = params.paymentType;
    paramsArray[i] = params.remark;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addPayment');
        callback(error,rows);
    })
}
const getPayment = (params,callback) => {
    let query = " select ui.user_name,ui.phone,pi.* from payment_info pi " +
                " left join user_info ui on ui.id=pi.user_id " +
                " where pi.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and pi.user_id =? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and pi.order_id =? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone =? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name =? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and pi.type =? ";
    }
    if(params.pId){
        paramsArray[i++] = params.pId;
        query = query + " and pi.p_id =? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart+" 00:00:00";
        query = query + " and pi.created_on >=? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd+" 23:59:59";
        query = query + " and pi.created_on <=? ";
    }
    if(params.paymentId){
        paramsArray[i++] = params.paymentId;
        query = query + " and pi.id =? ";
    }
    query = query + " order by pi.created_on desc";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getPayment');
        callback(error,rows);
    })
}
const updateStatus = (req,res,next) => {
    let params = req.params;
    let query = " update payment_info set status = ? where user_id = ? and id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.paymentId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateStatus');
        callback(error,rows);
    })
}
const addWechatPayment = (params,callback) => {
    let query = " insert into payment_info (user_id,order_id,total_fee,status,type,payment_type) values(?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.totalFee;
    paramsArray[i++] = 0;
    paramsArray[i++] = 1;
    paramsArray[i] = 1;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addWechatPayment');
        callback(error,rows);
    })
}
const updateWechatPayment = (params,callback) => {
    let query = " update payment_info set type=?,status=?,transaction_id=? where payment_id = ? and nonce_str=?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.type;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.transactionId;
    paramsArray[i++] = params.paymentId;
    paramsArray[i] = params.nonceStr;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateWechatPayment');
        callback(error,rows);
    })
}
const addWechatRefund = (params,callback) => {
    let query = " insert into payment_info(user_id,order_id,type,p_id) values(?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.type;
    paramsArray[i] = params.paymentId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addWechatRefund');
        callback(error,rows);
    })
}
const updateRefund = (params,callback) => {
    let query = " update payment_info set total_fee=?,remark=? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.totalFee;
    paramsArray[i++] = params.remark;
    paramsArray[i] = params.paymentId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateRefund');
        callback(error,rows);
    })
}
const getRefundByPaymentId = (params,callback) => {
    let query = " select * from payment_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.paymentId){
        paramsArray[i] = params.paymentId;
        query = query + " and p_id = ?"
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getRefundByPaymentId');
        callback(error,rows);
    })
}
const getPaymentByRefundId = (params,callback) => {
    let query = " select * from payment_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.pId){
        paramsArray[i++] = params.pId;
        query = query + " and id = ?"
    }
    if(params.pId){
        paramsArray[i++] = params.pId;
        paramsArray[i] = params.pId;
        query = query + " or p_id = ? and p_id <> ?"
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getPaymentByRefundId');
        callback(error,rows);
    })
}
module.exports = {
    addPayment,
    getPayment,
    updateStatus,
    addWechatPayment,
    updateWechatPayment,
    addWechatRefund,
    updateRefund,
    getRefundByPaymentId,
    getPaymentByRefundId
}