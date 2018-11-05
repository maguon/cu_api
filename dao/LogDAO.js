'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('LogDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addLog = (params,callback) => {
    let query = "insert into log_info(order_id,log_num,log_company_id,product_des,remark,recv_name,recv_phone,recv_address)values(?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.logNum;
    paramsArray[i++] = params.logCompanyId;
    paramsArray[i++] = params.productDes;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.recvName;
    paramsArray[i++] = params.recvPhone;
    paramsArray[i] = params.recvAddress;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addLog');
        callback(error,rows);
    })
}
const getLog = (params,callback) => {
    let query = " select ci.*,oi.id,oi.total_price,oi.recv_name,oi.recv_phone,oi.recv_address,oi.total_freight from log_info ci " +
                " left join order_info oi on oi.id=ci.order_id " +
                " where ci.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ci.user_id =? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and ci.order_id =? ";
    }
    if(params.logId){
        paramsArray[i] = params.logId;
        query = query + " and ci.id =? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getLog');
        callback(error,rows);
    })
}
const updateLog = (params,callback) => {
    let query = "update log_info set product_des=?,remark=?,recv_name=?,recv_phone=?,recv_address=? where id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.productDes;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.recvName;
    paramsArray[i++] = params.recvPhone;
    paramsArray[i++] = params.recvAddress;
    paramsArray[i] = params.logId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateLog');
        callback(error,rows);
    })
}
module.exports = {
    addLog,
    getLog,
    updateLog
}