'use strict'
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CarInfoDAO.js');
const db = require('../db/connection/MysqlDb.js');

const queryCarInfo = (params,callback) => {
    let query = "select *,date_format(created_on,'%H:%i:%s') as shortDate from car_info where id is not null and status = 1 and str_to_date(created_on,'%Y-%m-%d') = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.createdDateId;
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and id = ?";
    }
    if(params.policeId){
        paramsArray[i] = params.policeId;
        query = query + " and police_id = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryCarInfo ');
        return callback(error,rows);
    });
}
const updateStatus = (params,callback) => {
    let query = "update car_info set status = 0 where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i] = params.carId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateStatus ');
        return callback(error,rows);
    });
}
const addCar = (params,callback) => {
    let query = "insert into car_info(police_id,date_id,vin,engine_num,license_plate,phone,city,address) values(?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.policeId;
    paramsArray[i++] = params.createdDateId;
    paramsArray[i++] = params.vin;
    paramsArray[i++] = params.engineNum;
    paramsArray[i++] = params.licensePlate;
    paramsArray[i++] = params.phone;
    paramsArray[i++] = params.city;
    paramsArray[i] = params.address;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' addCar ');
        return callback(error,rows);
    });
}
const queryCarNumByDate = (params,callback) => {
    let query = "select DATE_FORMAT(ci.created_on,'%Y年%m月%d日') as date, " +
                "count(ci.id) as num from car_info ci " +
                "left join date_base db on db.id=ci.date_id " +
                "where db.y_month = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.yMonth;
    if(params.policeId){
        paramsArray[i] = params.policeId;
        query = query + " and ci.police_id = ?";
    }
    query = query + "  GROUP BY STR_TO_DATE(ci.created_on,'%Y-%m-%d') order by ci.created_on desc ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryCarNumByDate ');
        return callback(error,rows);
    });
}
const queryCarInfoByDate = (params,callback) => {
    let query = "select ci.* from car_info ci " +
                "left join date_base db on db.id=ci.date_id " +
                "where db.id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.yMonthDay;
    if(params.carId){
        paramsArray[i++] = params.carId;
        query = query + " and ci.id = ?";
    }
    if(params.policeId){
        paramsArray[i] = params.policeId;
        query = query + " and ci.police_id = ?";
    }
    if(params.createdStart){
        paramsArray[i++] = params.createdStart +" 00:00:00";
        query = query + " and ci.created_on >= ? ";
    }
    if(params.createdEnd){
        paramsArray[i] = params.createdEnd +" 23:59:59";
        query = query + " and ci.created_on <= ? ";
    }
    if(params.licensePlate){
        paramsArray[i] = params.licensePlate;
        query = query + " and ci.license_plate = ? ";
    }
    query = query + " order by ci.created_on desc ";
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryCarInfoByDate ');
        return callback(error,rows);
    });
}
module.exports = {
    queryCarInfo,
    updateStatus,
    addCar,
    queryCarNumByDate,
    queryCarInfoByDate
}