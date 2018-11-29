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
    let query = " select count(id) as user_count from user_info where id is not null ";
    let paramsArray=[],i=0;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getUserStat ');
        return callback(error,rows);
    });
}
const getUserCarStat = (params,callback) => {
    let query = " select count(id) as car_count from user_car where id is not null ";
    let paramsArray=[],i=0;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getUserCarStat ');
        return callback(error,rows);
    });
}
const getSuperviseStat = (params,callback) => {
    let query = " select count(id) as supervise_count from supervise_info where id is not null ";
    let paramsArray=[],i=0;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getSuperviseStat ');
        return callback(error,rows);
    });
}
const getCheckCarStatByMonth = (params,callback) => {
    let query = " select db.y_month,count(cci.id) as checkCar_count from check_car_info cci " +
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
    let query = " select db.y_month,ms.id as payment_status,count(cci.id) as order_count from date_base db " +
                " inner join message_status ms " +
                " left join order_info cci on db.id=cci.date_id and ms.id=cci.payment_status " +
                " where db.id is not null ";
    let paramsArray=[],i=0;
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and db.y_month = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and cci.status = ? ";
    }
    if(params.paymentStatus){
        paramsArray[i++] = params.paymentStatus;
        query = query + " and cci.payment_status = ? ";
    }
    if(params.logStatus){
        paramsArray[i++] = params.logStatus;
        query = query + " and cci.log_status = ? ";
    }
    query = query + " group by db.y_month,ms.id order by y_month desc ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getOrderStatByMonth ');
        return callback(error,rows);
    });
}
const getLogStatByMonth = (params,callback) => {
    let query = " select db.y_month,ms.id as log_status,count(cci.id) as log_count from date_base db " +
                " inner join message_status ms " +
                " left join log_info cci on ms.id=cci.status and db.id=cci.date_id " +
                " where db.id is not null ";
    let paramsArray=[],i=0;
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and db.y_month = ? ";
    }
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and cci.status = ? ";
    }
    query = query + " group by db.y_month,ms.id order by db.y_month desc ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getLogStatByMonth ');
        return callback(error,rows);
    });
}
const getOrderFeedbackStatByMonth = (params,callback) => {
    let query = " select db.y_month,ms.id as feedback_status,count(cci.id) as feedback_count from date_base db " +
                " inner join message_status ms " +
                " left join order_feedback cci on db.id=cci.date_id and ms.id=cci.status " +
                " where db.id is not null ";
    let paramsArray=[],i=0;
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and db.y_month = ? ";
    }
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and cci.status = ? ";
    }
    query = query + " group by db.y_month,ms.id order by y_month desc ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getOrderFeedbackStatByMonth ');
        return callback(error,rows);
    });
}
const getPaymentFeeByMonth = (params,callback) => {
    let query = " select db.y_month,ms.id as payment_status,if(isnull(sum(cci.total_fee)),0,sum(cci.total_fee)) as payment_fee from date_base db " +
                " inner join message_status ms " +
                " left join payment_info cci on db.id=cci.date_id and ms.id=cci.type " +
                " where db.id is not null and cci.status = 1";
    let paramsArray=[],i=0;
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and db.y_month = ? ";
    }
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and cci.status = ? ";
    }
    query = query + " group by db.y_month,ms.id order by y_month desc ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getPaymentFeeByMonth ');
        return callback(error,rows);
    });
}
const getCheckCarByMonth = (params,callback) => {
    let query = " select db.y_month,count(cci.id) as checkCar_count from date_base db" +
                " left join check_car_info cci on db.id=cci.date_id " +
                " where db.id is not null ";
    let paramsArray=[],i=0;
    if(params.yMonthStart){
        paramsArray[i++] = params.yMonthStart;
        query = query + " and db.y_month >= ? "
    }
    if(params.yMonthEnd){
        paramsArray[i] = params.yMonthEnd;
        query = query + " and db.y_month <= ? "
    }
    query = query + " group by db.y_month order by db.y_month desc ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getCheckCarByMonth ');
        return callback(error,rows);
    });
}
const getCheckCarByDay=(params,callback)=>{
    let query = " select db.id,count(ui.id) as user_count from date_base db " +
                " left join check_car_info ui on db.id=ui.date_id " +
                " where db.id is not null ";
    let paramsArray =[],i=0;
    if(params.dateIdStart){
        paramsArray[i++] = params.dateIdStart;
        query = query + " and db.id >= ? "
    }
    if(params.dateId){
        paramsArray[i] = params.dateId;
        query = query + " and db.id <= ? "
    }
    query = query + " group by db.id order by db.id desc ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getCheckCarByDay');
        callback(error,rows);
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
    getOrderStatByMonth,
    getLogStatByMonth,
    getOrderFeedbackStatByMonth,
    getPaymentFeeByMonth,
    getCheckCarByMonth,
    getCheckCarByDay
}