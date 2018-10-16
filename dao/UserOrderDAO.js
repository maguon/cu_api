'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserOrderDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addOrder = (params,callback) => {
    let query = "insert into user_order(user_id,price,address,remark)values(?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = 5;
    paramsArray[i++] = params.address;
    paramsArray[i] = params.remark;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addOrder');
        callback(error,rows);
    })
}
const getOrder = (params,callback) => {
    let query = "select * from user_order where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id =?";
    }
    if(params.userOrderId){
        paramsArray[i] = params.userOrderId;
        query = query + " and id =?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getOrder');
        callback(error,rows);
    })
}
const updateOrderStatus = (params,callback) => {
    let query = "update user_order set status = ? where user_id=? and id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.userOrderId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateOrderStatus');
        callback(error,rows);
    })
}
module.exports = {
    addOrder,
    getOrder,
    updateOrderStatus
}