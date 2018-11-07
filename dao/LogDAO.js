'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('LogDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addLog = (params,callback) => {
    let query = "insert into log_info(user_id,order_id,product_des,type,recv_name,recv_phone,recv_address)values(?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.productDes;
    paramsArray[i++] = params.type;
    paramsArray[i++] = params.recvName;
    paramsArray[i++] = params.recvPhone;
    paramsArray[i] = params.recvAddress;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addLog');
        callback(error,rows);
    })
}
const getLog = (params,callback) => {
    let query = " select lc.company_name,ci.*,oi.id as order_id,oi.total_price,oi.total_freight from log_info ci " +
                " left join order_info oi on oi.id=ci.order_id " +
                " left join log_company lc on lc.id=ci.log_company_id " +
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
        paramsArray[i++] = params.logId;
        query = query + " and ci.id =? ";
    }
    if(params.logCompanyId){
        paramsArray[i++] = params.logCompanyId;
        query = query + " and ci.log_company_id =? ";
    }
    if(params.recvName){
        paramsArray[i++] = params.recvName;
        query = query + " and ci.recv_name =? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart;
        query = query + " and ci.created_on >=? "+ " 00:00:00";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd;
        query = query + " and ci.created_on <=? "+ " 23:59:59";
    }
    if(params.updatedOnStart){
        paramsArray[i++] = params.updatedOnStart;
        query = query + " and ci.update_on >=? "+" 00:00:00";
    }
    if(params.updatedOnEnd){
        paramsArray[i++] = params.updatedOnEnd;
        query = query + " and ci.update_on <=? "+" 23:59:59";
    }
    if(params.recvPhone){
        paramsArray[i++] = params.recvPhone;
        query = query + " and ci.recv_phone =? ";
    }
    query = query + " order by ci.created_on desc ";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getLog');
        callback(error,rows);
    })
}
const updateLog = (params,callback) => {
    let query = "update log_info set remark=?,log_num=?,log_company_id=?,freight=? where id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.logNum;
    paramsArray[i++] = params.logCompanyId;
    paramsArray[i++] = params.freight;
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