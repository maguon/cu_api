'use strict';

const db=require('../db/connection/MysqlDb.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('AdminUserDAO.js');

const createAdminUser = (params,callback) => {
    let query = " insert into admin_user (user_name,real_name,password,phone) values ( ? , ? , ? , ? )";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.userName;
    paramsArray[i++]=params.realName;
    paramsArray[i++]=params.password;
    paramsArray[i]=params.phone;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' createAdminUser ');
        return callback(error,rows);
    });
}
const queryAdminUser = (params,callback) => {
    let query = " select password,id,user_name,real_name,phone,status,type,created_on,updated_on from admin_user where id is not null ";
    let paramsArray=[],i=0;
    if(params.adminId){
        paramsArray[i++] = params.adminId;
        query = query + " and id = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and user_name = ? ";
    }
    if(params.phone){
        paramsArray[i] = params.phone;
        query = query + " and phone = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryAdminUser ');
        return callback(error,rows);
    });
}
const queryAdminInfo = (params,callback) => {
    let query = " select id,user_name,real_name,phone,status,type,created_on,updated_on from admin_user where id is not null";
    let paramsArray=[],i=0;
    if(params.adminId){
        query = query + " and id = ? ";
        paramsArray[i++]=params.adminId;
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryUser ');
        return callback(error,rows);
    });
}
const updateInfo = (params,callback) => {
    let query = " update admin_user set real_name = ? ,phone = ? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.realName;
    paramsArray[i++] = params.phone;
    paramsArray[i] = params.adminId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateInfo ');
        return callback(error,rows);
    });
}
const updatePassword = (params,callback) => {
    let query = " update admin_user set password = ? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.password;
    paramsArray[i] = params.adminId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updatePassword ');
        return callback(error,rows);
    });
}
const getUserStat = (params,callback) => {
    let query = " select count(id) from user_info where id is not null ";
    let paramsArray=[],i=0;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getUserStat ');
        return callback(error,rows);
    });
}
const getUserCarStat = (params,callback) => {
    let query = " select count(id) from user_car where id is not null ";
    let paramsArray=[],i=0;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getUserCarStat ');
        return callback(error,rows);
    });
}
const getSuperviseStat = (params,callback) => {
    let query = " select count(id) from supervise_info where id is not null ";
    let paramsArray=[],i=0;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getSuperviseStat ');
        return callback(error,rows);
    });
}
const getCheckCarStatByMonth = (params,callback) => {
    let query = " select db.y_month,count(cci.id) from check_car_info cci " +
                " left join date_base db on db.id=cci.date_id " +
                " where cci.id is not null ";
    let paramsArray=[],i=0;
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and db.y_month = ? ";
    }
    query = query + " group by db.y_month ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getCheckCarStatByMonth ');
        return callback(error,rows);
    });
}
const getOrderStatByMonth = (params,callback) => {
    let query = " select db.y_month,count(cci.id) from order_info cci " +
                " left join date_base db on db.id=cci.date_id " +
                " where cci.id is not null ";
    let paramsArray=[],i=0;
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and db.y_month = ? ";
    }
    query = query + " group by db.y_month ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getOrderStatByMonth ');
        return callback(error,rows);
    });
}
module.exports = {
    createAdminUser,
    queryAdminUser,
    queryAdminInfo,
    updateInfo,
    updatePassword,
    getUserStat,
    getUserCarStat,
    getSuperviseStat,
    getCheckCarStatByMonth,
    getOrderStatByMonth
}