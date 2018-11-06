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
    let query = "select * from payment_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id =? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and order_id =? ";
    }
    if(params.paymentId){
        paramsArray[i] = params.paymentId;
        query = query + " and id =? ";
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
module.exports = {
    addPayment,
    getPayment,
    updateStatus
}