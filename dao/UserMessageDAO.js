'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserMessageDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addMessage = (params,callback) => {
    let query = "insert into user_message(user_id,supervise_id,message_name,message_order,license_plate,address)values(?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.superviseId;
    paramsArray[i++] = params.messageName;
    paramsArray[i++] = params.messageOrder;
    paramsArray[i++] = params.licensePlate;
    paramsArray[i] = params.address;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addMessage');
        callback(error,rows);
    })
}
const getMessage = (params,callback) => {
    let query = " select * from user_message where id is not null  ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.userMessageId){
        paramsArray[i++] = params.userMessageId;
        query = query + " and id = ? ";
    }
    if(params.messageName){
        paramsArray[i++] = params.messageName;
        query = query + " and message_name = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    if(params.licensePlate){
        paramsArray[i++] = params.licensePlate;
        query = query + " and license_plate = ? ";
    }
    if(params.createdStartOn){
        paramsArray[i++] = params.createdStartOn;
        query = query + " and created_on >= ? ";
    }
    if(params.createdEndOn){
        paramsArray[i++] = params.createdEndOn;
        query = query + " and created_on <= ? ";
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
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and status = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('queryUserMessageNumById');
        callback(error,rows);
    })
}
const updateUserMessageStatus = (params,callback) => {
    let query = "update user_message set status = ? where user_id=? and id=? ";
    let paramsArray = [],i=0;
        paramsArray[i++] = params.status;
        paramsArray[i++] = params.userId;
        paramsArray[i] = params.msgId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUserMessageStatus');
        callback(error,rows);
    })
}
module.exports = {
    addMessage,
    getMessage,
    queryUserMessageNumById,
    updateUserMessageStatus
}