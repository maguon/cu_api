'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserCarDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const queryUserCar = (params,callback) => {
    let query = "select * from user_car where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.userCarId){
        paramsArray[i++] = params.userCarId;
        query = query + " and id = ? ";
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
const updatePaperRemark = (params,callback) => {
    let query = "update user_car set paper_type=?,remark=? where id = ?";
    let paramsArray = [],i=0;
        paramsArray[i++] = params.paperType;
        paramsArray[i++] = params.remark;
        paramsArray[i] = params.userCarId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updatePaperRemark');
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
const queryUserCarNumById = (params,callback) => {
    let query = "select count(id) from user_car where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.userCarId){
        paramsArray[i++] = params.userCarId;
        query = query + " and id = ? ";
    }
    if(params.start&&params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('queryUserCarNumById');
        callback(error,rows);
    })
}
module.exports = {
    queryUserCar,
    updatePaperRemark,
    addUserCar,
    delUserCar,
    queryUserCarNumById
}