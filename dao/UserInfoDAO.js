'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const queryUser = (params,callback) => {
    let query = "select * from user_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and id = ? ";
    }
    if(params.licensePlate){
        paramsArray[i++] = params.licensePlate;
        query = query + " and license_plate = ? ";
    }
    if(params.userName){
        query = query + " and user_name like '%"+params.userName+"%'";
    }
    if(params.phone){
        paramsArray[i] = params.phone;
        query = query + " and password = ? "
    }
    if(params.wechatId){
        paramsArray[i] = params.wechatId;
        query = query + " and wechat_id = ? "
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('queryUser');
        callback(error,rows);
    })
}
const createUser = (params,callback)=>{
    let query = "insert into user_info (user_name,license_plate,wechat_id,password,gender,phone) values(?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++]=params.userName;
    paramsArray[i++]=params.licensePlate;
    paramsArray[i++]=params.wechatId;
    paramsArray[i++]=params.password;
    paramsArray[i++]=params.gender;
    paramsArray[i]=params.phone;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('createUser');
        callback(error,rows);
    });
}
const updateUser=(params,callback)=>{
    let query = "update user_info set user_name=? ,gender=? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userName;
    paramsArray[i++] = params.gender;
    paramsArray[i++] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUser');
        callback(error,rows);
    });
}
const lastLoginOn=(params,callback)=>{
    let query = "update user_info set last_login_on = ? where wechat_id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.lastLoginOn;
    paramsArray[i++] = params.wechatId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('lastLoginOn');
        callback(error,rows);
    });
}
const updatePassword=(params,callback)=>{
    let query = "update user_info set password = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.newPassword;
    paramsArray[i++] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePassword');
        callback(error,rows);
    });
};
const updatePhone=(params,callback)=>{
    let query = "update user_info set phone = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.phone;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePhone');
        callback(error,rows);
    });
}
const updateStatus=(params,callback)=>{
    let query = "update user_info set wechat_status = ? where id = ? ";
    let paramsArray =[],i=0;
    paramsArray[i++] = params.wechatStatus;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateStatus');
        callback(error,rows);
    });
}
module.exports = {
    queryUser,
    createUser,
    lastLoginOn,
    updateUser,
    updatePassword,
    updatePhone,
    updateStatus
}