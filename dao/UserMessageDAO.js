'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserMessageDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addMessage = (params,callback) => {
    let query = "insert into user_message(user_id,message,address)values(?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.message;
    paramsArray[i] = params.address;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addMessage');
        callback(error,rows);
    })
}
const getMessage = (params,callback) => {
    let query = "select * from user_message where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.userMessageId){
        paramsArray[i++] = params.userMessageId;
        query = query + " and id = ? ";
    }
    if(params.start&&params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getMessage');
        callback(error,rows);
    })
}
const queryUserMessageNumById = (params,callback) => {
    let query = "select count(id) from user_message where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('queryUserMessageNumById');
        callback(error,rows);
    })
}
module.exports = {
    addMessage,
    getMessage,
    queryUserMessageNumById
}