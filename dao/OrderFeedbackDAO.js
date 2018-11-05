'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderFeedbackDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addOrderFeedback = (params,callback) => {
    let query = "insert into after_sale(order_id,apply_reason)values(?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.orderId;
    paramsArray[i] = params.applyReason;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addOrderFeedback');
        callback(error,rows);
    })
}
const getOrderFeedback = (params,callback) => {
    let query = "select * from after_sale where id is not null ";
    let paramsArray = [],i=0;
    if(params.orderId){
        paramsArray[i] = params.orderId;
        query = query + " and order_id =? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrderFeedback');
        callback(error,rows);
    })
}
const updateOrderFeedbackPayment = (params,callback) => {
    let query = "update after_sale set process_remark=?,process_method=?,refund_amount=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.processRemark;
    paramsArray[i++] = params.processMethod;
    paramsArray[i++] = params.refundAmount;
    paramsArray[i] = params.orderFeedbackId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderFeedbackPayment');
        callback(error,rows);
    })
}
const updateOrderFeedbackCount = (params,callback) => {
    let query = "update after_sale set process_remark=?,process_method=?,replace_name=?,replace_count=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.processRemark;
    paramsArray[i++] = params.processMethod;
    paramsArray[i++] = params.replaceName;
    paramsArray[i++] = params.replaceCount;
    paramsArray[i] = params.orderFeedbackId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderFeedbackCount');
        callback(error,rows);
    })
}
const updateOrderFeedbackRemark = (params,callback) => {
    let query = "update after_sale set process_remark=?,process_method=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.processRemark;
    paramsArray[i++] = params.processMethod;
    paramsArray[i] = params.orderFeedbackId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderFeedbackRemark');
        callback(error,rows);
    })
}
const updateOrderFeedbackStatus = (params,callback) => {
    let query = "update after_sale set status=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.orderFeedbackId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderFeedbackStatus');
        callback(error,rows);
    })
}
module.exports = {
    addOrderFeedback,
    getOrderFeedback,
    updateOrderFeedbackPayment,
    updateOrderFeedbackCount,
    updateOrderFeedbackRemark,
    updateOrderFeedbackStatus
}