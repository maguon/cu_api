'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserCarDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const queryUserCar = (params,callback) => {
    let query = " select ui.user_name,ui.phone,uc.* from user_car uc " +
                " left join user_info ui on ui.id=uc.user_id " +
                " where uc.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and uc.user_id = ? ";
    }
    if(params.userCarId){
        paramsArray[i++] = params.userCarId;
        query = query + " and uc.id = ? ";
    }
    if(params.licensePlate){
        paramsArray[i++] = params.licensePlate;
        query = query + " and uc.license_plate = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name = ? ";
    }
    if(params.vin){
        paramsArray[i++] = params.vin;
        query = query + " and uc.vin = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and uc.status = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone = ? ";
    }
    if(params.createdStartOn){
        paramsArray[i++] = params.createdStartOn +" 00:00:00";
        query = query + " and uc.created_on >= ? ";
    }
    if(params.createdEndOn){
        paramsArray[i++] = params.createdEndOn+" 23:59:59";
        query = query + " and uc.created_on <= ? ";
    }
    if(params.start&&params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('queryUserCar');
        callback(error,rows);
    })
}
const updateUserCar = (params,callback) => {
    let query = "update user_car set vin=?,engine_num=? where id = ?";
    let paramsArray = [],i=0;
        paramsArray[i++] = params.vin;
        paramsArray[i++] = params.engineNum;
        paramsArray[i] = params.userCarId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUserCar');
        callback(error,rows);
    })
}
const updateUserCarByVin = (params,callback) => {
    let query = "update user_car set user_id = ? ,status=? where vin=? and engine_num=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.vin;
    paramsArray[i] = params.engineNum;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUserCar');
        callback(error,rows);
    })
}
const addUserCar = (params,callback) => {
    let query = " insert into user_car(user_id,vin,make_id,make_name,model_id,model_name,engine_num,license_plate) " +
                " values(?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.vin;
    paramsArray[i++] = params.makeId;
    paramsArray[i++] = params.makeName;
    paramsArray[i++] = params.modelId;
    paramsArray[i++] = params.modelName;
    paramsArray[i++] = params.engineNum;
    paramsArray[i] = params.licensePlate;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addUserCar');
        callback(error,rows);
    })
}
const delUserCar = (params,callback) => {
    let query = "delete from user_car where user_id=? and id=?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i] = params.userCarId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('delUserCar');
        callback(error,rows);
    })
}
const getUserCarNum = (params,callback) => {
    let query = "select num from user_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i] = params.userId;
        query = query + " and id = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserCarNum');
        callback(error,rows);
    })
}
const updateUserCarNum = (params,callback) => {
    let query = "update user_info set num = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.num;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUserCarNum');
        callback(error,rows);
    })
}
const updateUserCarStatus = (params,callback) => {
    let query = "update user_car set status = ?,user_id='' where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.userCarId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUserCarStatus');
        callback(error,rows);
    })
}
module.exports = {
    queryUserCar,
    updateUserCar,
    addUserCar,
    delUserCar,
    getUserCarNum,
    updateUserCarNum,
    updateUserCarStatus,
    updateUserCarByVin
}