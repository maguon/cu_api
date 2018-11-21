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
    let query = " select of.*,ui.phone,ui.user_name,oi.total_price from order_feedback of " +
                " left join user_info ui on ui.id=of.user_id " +
                " left join order_info oi on oi.id=of.order_id " +
                " where of.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and of.user_id =? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and of.order_id =? ";
    }
    if(params.orderFeedbackId){
        paramsArray[i++] = params.orderFeedbackId;
        query = query + " and of.id =? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name =? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone =? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart + " 00:00:00";
        query = query + " and of.created_on >=? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd+ " 23:59:59";
        query = query + " and of.created_on <=? ";
    }
    if(params.updatedOnStart){
        paramsArray[i++] = params.updatedOnStart;
        query = query + " and of.updated_on >=? "+ " 00:00:00";
    }
    if(params.updatedOnEnd){
        paramsArray[i++] = params.updatedOnEnd+" 23:59:59";
        query = query + " and of.updated_on <=? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and of.status =? ";
    }
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
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