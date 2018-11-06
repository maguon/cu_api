'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('OrderFeedbackDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addOrderFeedback = (params,callback) => {
    let query = "insert into order_feedback(user_id,order_id,apply_reason)values(?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.orderId;
    paramsArray[i] = params.applyReason;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addOrderFeedback');
        callback(error,rows);
    })
}
const getOrderFeedback = (params,callback) => {
    let query = "select * from order_feedback where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id =? ";
    }
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
    let query = "update order_feedback set process_remark=?,process_method=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.processRemark;
    paramsArray[i++] = params.processMethod;
    paramsArray[i] = params.orderFeedbackId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderFeedbackPayment');
        callback(error,rows);
    })
}
const updateOrderFeedbackCount = (params,callback) => {
    let query = "update order_feedback set process_remark=?,process_method=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.processRemark;
    paramsArray[i++] = params.processMethod;
    paramsArray[i] = params.orderFeedbackId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderFeedbackCount');
        callback(error,rows);
    })
}
const updateOrderFeedbackRemark = (params,callback) => {
    let query = "update order_feedback set process_remark=?,process_method=? where id = ? ";
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
    let query = "update order_feedback set status=? where id = ? ";
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