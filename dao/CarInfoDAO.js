'use strict'
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CarInfoDAO.js');
const db = require('../db/connection/MysqlDb.js');

const queryCarInfo = (params,callback) => {
    let query = "select * from car_info where id is not null and status = 1 and to_date(created_on,'yyyyMMdd') = ? ";
    let paramsArray = [],i=0
    paramsArray[i++] = params.strDate;
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
    let query = "insert into car_info(police_id,vin,engine_num,license_plate,phone,city,address) values(?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.policeId;
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
module.exports = {
    queryCarInfo,
    updateStatus,
    addCar
}