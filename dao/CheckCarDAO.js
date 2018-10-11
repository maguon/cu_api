'use strict'
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CheckCarDAO.js');
const db = require('../db/connection/MysqlDb.js');

const queryCarInfo = (params,callback) => {
    let query = " select *,date_format(created_on,'%H:%i:%s') as shortDate from user_car " +
                " where supervise_id <>0 and status = 1 and str_to_date(created_on,'%Y-%m-%d') = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.createdDateId;
    if(params.superviseId){
        paramsArray[i++] = params.superviseId;
        query = query + " and supervise_id = ?";
    }
    if(params.userCarId){
        paramsArray[i] = params.userCarId;
        query = query + " and id = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryCarInfo ');
        return callback(error,rows);
    });
}
const updateStatus = (params,callback) => {
    let query = "update user_car set status = 0 where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i] = params.userCarId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateStatus ');
        return callback(error,rows);
    });
}
const addCheckCar = (params,callback) => {
    let query = "insert into check_car_info(supervise_id,user_id,date_id,vin,make_id,make_name,model_id,model_name,engine_num,license_plate,phone,city,address) values(?,?,?,?,?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.superviseId;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.createdDateId;
    paramsArray[i++] = params.vin;
    paramsArray[i++] = params.makeId;
    paramsArray[i++] = params.makeName;
    paramsArray[i++] = params.modelId;
    paramsArray[i++] = params.modelName;
    paramsArray[i++] = params.engineNum;
    paramsArray[i++] = params.licensePlate;
    paramsArray[i++] = params.phone;
    paramsArray[i++] = params.city;
    paramsArray[i] = params.address;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' addCheckCar ');
        return callback(error,rows);
    });
}
const queryCarByMonth = (params,callback) => {
    let query = "select DATE_FORMAT(ci.created_on,'%Y年%m月%d日') as date, " +
                "count(ci.id) as num from check_car_info ci " +
                "left join date_base db on db.id=ci.date_id " +
                "where 1=1 ";
    let paramsArray = [],i=0;
    if(params.superviseId){
        paramsArray[i++] = params.superviseId;
        query = query + " and ci.supervise_id = ?";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and db.y_Month = ?";
    }
    query = query + "  GROUP BY STR_TO_DATE(ci.created_on,'%Y-%m-%d') order by ci.created_on desc ";
    if(params.start&&params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryCarByMonth ');
        return callback(error,rows);
    });
}
const queryCarByDay = (params,callback) => {
    let query = "select ci.*,date_format(ci.created_on,'%H:%i:%s') as shortDate from check_car_info ci " +
                "left join date_base db on db.id=ci.date_id " +
                "where 1=1 ";
    let paramsArray = [],i=0;
    if(params.superviseId){
        paramsArray[i++] = params.superviseId;
        query = query + " and ci.supervise_id = ?";
    }
    if(params.yMonthDay){
        paramsArray[i++] = params.yMonthDay;
        query = query + " and db.id = ?";
    }
    if(params.checkCarId){
        paramsArray[i++] = params.checkCarId;
        query = query + " and ci.id = ?";
    }
    if(params.superviseId){
        paramsArray[i++] = params.superviseId;
        query = query + " and ci.supervise_id = ?";
    }
    if(params.createdStart){
        paramsArray[i++] = params.createdStart +" 00:00:00";
        query = query + " and ci.created_on >= ? ";
    }
    if(params.createdEnd){
        paramsArray[i++] = params.createdEnd +" 23:59:59";
        query = query + " and ci.created_on <= ? ";
    }
    if(params.licensePlate){
        paramsArray[i] = params.licensePlate;
        query = query + " and ci.license_plate = ? ";
    }
    query = query + " order by ci.created_on desc ";
    if(params.start&&params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?,? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryCarByDay ');
        return callback(error,rows);
    });
}
const queryCarNumByDay = (params,callback) => {
    let query = " select count(id) as count from user_car " +
                " where supervise_id <>0 and status = 1 and str_to_date(created_on,'%Y-%m-%d') = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.yMonthDay;
    if(params.superviseId){
        paramsArray[i] = params.superviseId;
        query = query + " and supervise_id = ?";
    }
    query = query + " order by created_on desc ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryCarNumByDay ');
        return callback(error,rows);
    });
}
module.exports = {
    queryCarInfo,
    updateStatus,
    addCheckCar,
    queryCarByMonth,
    queryCarByDay,
    queryCarNumByDay
}