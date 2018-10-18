'use strict'
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CheckCarDAO.js');
const db = require('../db/connection/MysqlDb.js');

const queryCarInfo = (params,callback) => {
    let query = " select c.license_plate,ui.phone,uc.*,date_format(uc.created_on,'%H:%i:%s') as shortDate from check_car_info uc " +
                " left join user_info ui on ui.id=uc.user_id " +
                " left join user_car c on c.id=uc.car_id" +
                " where uc.id is not null ";
    let paramsArray = [],i=0;
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and uc.status = ?";
    }
    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " and uc.date_id = ?";
    }
    if(params.superviseId){
        paramsArray[i++] = params.superviseId;
        query = query + " and uc.supervise_id = ?";
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
    let query = "update check_car_info set status = ? where id = ? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.checkCarId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateStatus ');
        return callback(error,rows);
    });
}
const addCheckCar = (params,callback) => {
    let query = "insert into check_car_info(supervise_id,user_id,car_id,date_id,address) values(?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.superviseId;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.userCarId;
    paramsArray[i++] = params.createdDateId;
    paramsArray[i] = params.address;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' addCheckCar ');
        return callback(error,rows);
    });
}
const queryCarByMonth = (params,callback) => {
    let query = " select DATE_FORMAT(ci.created_on,'%Y年%m月%d日') as date, " +
                " count(ci.id) as num from check_car_info ci " +
                " left join date_base db on db.id=ci.date_id " +
                " where ci.id is not null ";
    let paramsArray = [],i=0;
    if(params.superviseId){
        paramsArray[i++] = params.superviseId;
        query = query + " and ci.supervise_id = ?";
    }
    if(params.yMonth){
        paramsArray[i++] = params.yMonth;
        query = query + " and db.y_Month = ?";
    }
    query = query + "  GROUP BY ci.date_id order by ci.created_on desc ";
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
    let query = " select ui.phone,uc.vin,uc.make_name,uc.model_name,uc.engine_num,uc.license_plate,ci.*,date_format(ci.created_on,'%H:%i:%s') as shortDate from check_car_info ci " +
                " left join date_base db on db.id=ci.date_id " +
                " left join user_car uc on uc.id=ci.car_id " +
                " left join user_info ui on ui.id=ci.user_id " +
                " where ci.id is not null ";
    let paramsArray = [],i=0;
    if(params.superviseId){
        paramsArray[i++] = params.superviseId;
        query = query + " and ci.supervise_id = ?";
    }
    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " and ci.date_id = ?";
    }
    if(params.checkCarId){
        paramsArray[i++] = params.checkCarId;
        query = query + " and ci.id = ?";
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
        paramsArray[i++] = params.licensePlate;
        query = query + " and uc.license_plate = ? ";
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
    let query = " select count(uc.id) as count from check_car_info uc " +
                " left join date_base db on db.id=uc.date_id " +
                " where uc.id is not null ";
    let paramsArray = [],i=0;
    if(params.superviseId){
        paramsArray[i++] = params.superviseId;
        query = query + " and uc.supervise_id = ?";
    }
    if(params.dateId){
        paramsArray[i++] = params.dateId;
        query = query + " and uc.date_id = ?";
    }
    if(params.status){
        paramsArray[i] = params.status;
        query = query + " and uc.status = ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryCarNumByDay ');
        return callback(error,rows);
    });
}
const queryCheckCar = (params,callback) => {
    let query = " select uc.license_plate,si.user_name as superviseName,ui.user_name,cci.* from check_car_info cci " +
                " left join user_info ui on ui.id=cci.user_id " +
                " left join supervise_info si on si.id=cci.supervise_id " +
                " left join user_car uc on uc.user_id=ui.id " +
                " where cci.id is not null ";
    let paramsArray = [],i=0;
    if(params.superviseId){
        paramsArray[i++] = params.superviseId;
        query = query + " and cci.supervise_id = ?";
    }
    if(params.checkCarId){
        paramsArray[i++] = params.checkCarId;
        query = query + " and cci.id = ?";
    }
    if(params.licensePlate){
        paramsArray[i++] = params.licensePlate;
        query = query + " and cci.license_plate = ?";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and cci.phone = ?";
    }
    if(params.superviseName){
        paramsArray[i++] = params.superviseName;
        query = query + " and si.user_name = ?";
    }
    if(params.createdStartOn){
        paramsArray[i++] = params.createdStartOn;
        query = query + " and cci.created_on >= ?";
    }
    if(params.createdEndOn){
        paramsArray[i++] = params.createdEndOn;
        query = query + " and cci.created_on <= ?";
    }
    if(params.start&&params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ?";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryCheckCar ');
        return callback(error,rows);
    });
}
module.exports = {
    queryCarInfo,
    updateStatus,
    addCheckCar,
    queryCarByMonth,
    queryCarByDay,
    queryCarNumByDay,
    queryCheckCar
}