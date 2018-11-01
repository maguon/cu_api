'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('AfterSaleDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addAfterSale = (params,callback) => {
    let query = "insert into after_sale(order_id,apply_reason)values(?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.orderId;
    paramsArray[i] = params.applyReason;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addAfterSale');
        callback(error,rows);
    })
}
const getAfterSale = (params,callback) => {
    let query = "select * from after_sale where id is not null ";
    let paramsArray = [],i=0;
    if(params.orderId){
        paramsArray[i] = params.orderId;
        query = query + " and order_id =? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getAfterSale');
        callback(error,rows);
    })
}
const updateAfterSalePayment = (params,callback) => {
    let query = "update after_sale set process_remark=?,process_method=?,refund_amount=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.processRemark;
    paramsArray[i++] = params.processMethod;
    paramsArray[i++] = params.refundAmount;
    paramsArray[i] = params.afterSaleId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateAfterSalePayment');
        callback(error,rows);
    })
}
const updateAfterSaleCount = (params,callback) => {
    let query = "update after_sale set process_remark=?,process_method=?,replace_name=?,replace_count=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.processRemark;
    paramsArray[i++] = params.processMethod;
    paramsArray[i++] = params.replaceName;
    paramsArray[i++] = params.replaceCount;
    paramsArray[i] = params.afterSaleId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateAfterSaleCount');
        callback(error,rows);
    })
}
const updateAfterSaleRemark = (params,callback) => {
    let query = "update after_sale set process_remark=?,process_method=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.processRemark;
    paramsArray[i++] = params.processMethod;
    paramsArray[i] = params.afterSaleId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateAfterSaleRemark');
        callback(error,rows);
    })
}
const updateAfterSaleStatus = (params,callback) => {
    let query = "update after_sale set status=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.afterSaleId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateAfterSaleStatus');
        callback(error,rows);
    })
}
module.exports = {
    addAfterSale,
    getAfterSale,
    updateAfterSalePayment,
    updateAfterSaleCount,
    updateAfterSaleRemark,
    updateAfterSaleStatus
}