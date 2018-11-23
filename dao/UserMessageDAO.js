'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserMessageDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addMessage = (params,callback) => {
    let query = "insert into user_message(date_id,user_id,supervise_id,car_id,message_name,message_order,address)values(?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.dateId;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.superviseId;
    paramsArray[i++] = params.carId;
    paramsArray[i++] = params.messageName;
    paramsArray[i++] = params.messageOrder;
    paramsArray[i] = params.address;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addMessage');
        callback(error,rows);
    })
}
const getMessage = (params,callback) => {
    let query = " select um.*,ui.user_name from user_message um " +
                " left join user_info ui on ui.id=um.user_id " +
                " where um.id is not null and user_type = 1 ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and um.user_id = ? ";
    }
    if(params.userMessageId){
        paramsArray[i++] = params.userMessageId;
        query = query + " and um.id = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and um.phone = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name = ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and um.type = ? ";
    }
    if(params.title){
        paramsArray[i++] = params.title;
        query = query + " and um.title = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and um.status = ? ";
    }
    if(params.readStatus){
        paramsArray[i++] = params.readStatus;
        query = query + " and um.read_status = ? ";
    }
    if(params.createdStartOn){
        paramsArray[i++] = params.createdStartOn+" 00:00:00";
        query = query + " and um.created_on >= ? ";
    }
    if(params.createdEndOn){
        paramsArray[i++] = params.createdEndOn+" 23:59:59";
        query = query + " and um.created_on <= ? ";
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
    let query = "select count(id) as count from user_message where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.userType){
        paramsArray[i++] = params.userType;
        query = query + " and user_type = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    if(params.readStatus){
        paramsArray[i] = params.readStatus;
        query = query + " and read_status = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('queryUserMessageNumById');
        callback(error,rows);
    })
}
const updateUserMessageStatus = (params,callback) => {
    let query = "update user_message set read_status = ? where user_id=? and id=? ";
    let paramsArray = [],i=0;
        paramsArray[i++] = params.status;
        paramsArray[i++] = params.userId;
        paramsArray[i] = params.msgId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUserMessageStatus');
        callback(error,rows);
    })
}
const getUserMessageStatByDay = (params,callback) => {
    let query = " select db.id,count(um.id) as count from user_message um " +
                " left join date_base db on db.id=um.date_id " +
                " where um.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and um.user_id = ? ";
    }
    if(params.userType){
        paramsArray[i++] = params.userType;
        query = query + " and um.user_type = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and um.status = ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and um.type = ? ";
    }
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and db.id >= ? ";
    }
    if(params.dateIdEnd){
        paramsArray[i] = params.dateIdEnd;
        query = query + " and db.id <= ? ";
    }
    query = query + " group by db.id ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserMessageStatByDay');
        callback(error,rows);
    })
}
const getUserMessageStatByMonth = (params,callback) => {
    let query = " select db.y_month,count(um.id) as count from user_message um " +
                " left join date_base db on db.id=um.date_id " +
                " where um.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and um.user_id = ? ";
    }
    if(params.userType){
        paramsArray[i++] = params.userType;
        query = query + " and um.user_type = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and um.status = ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and um.type = ? ";
    }
    if(params.monthStart){
        paramsArray[i++] = params.monthStart;
        query = query + " and db.y_month >= ? ";
    }
    if(params.monthEnd){
        paramsArray[i] = params.monthEnd;
        query = query + " and db.y_month <= ? ";
    }
    query = query + " group by db.y_month ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserMessageStatByMonth');
        callback(error,rows);
    })
}
module.exports = {
    addMessage,
    getMessage,
    queryUserMessageNumById,
    updateUserMessageStatus,
    getUserMessageStatByDay,
    getUserMessageStatByMonth
}