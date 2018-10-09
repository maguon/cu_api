'use strict';

const db=require('../db/connection/MysqlDb.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('PoliceDAO.js');

const createPolice = (params,callback) => {
    let query = " insert into police_info (user_name,gender,password,status,phone) values ( ?,? , ? , ? , ?  )";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.userName;
    paramsArray[i++]=params.gender;
    paramsArray[i++]=params.password;
    paramsArray[i++]=params.status;
    paramsArray[i]=params.phone;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' createPolice ');
        return callback(error,rows);
    });
}
const queryPolice = (params,callback) => {
    let query = " select * from police_info where id is not null ";
    let paramsArray=[],i=0;
    if(params.policeId){
        paramsArray[i++] = params.policeId;
        query = query + " and id = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and user_name = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and phone = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryPolice ');
        return callback(error,rows);
    });
}
const queryPoliceInfo = (params,callback) => {
    let query = " select user_name,phone,gender,date_format(created_on,'%Y年%m月%d日') as date from police_info where id is not null and str_to_date(created_on,'%Y-%m-%d') = ?";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.createdDateId;
    if(params.policeId){
        query = query + " and id = ? ";
        paramsArray[i]=params.policeId;
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' queryPoliceInfo ');
        return callback(error,rows);
    });
}
const updateInfo = (params,callback) => {
    let query = " update police_info set gender = ? ,phone = ? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.gender;
    paramsArray[i++] = params.phone;
    paramsArray[i] = params.policeId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateInfo ');
        return callback(error,rows);
    });
}
const updatePassword = (params,callback) => {
    let query = " update police_info set password = ? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.password;
    paramsArray[i] = params.policeId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updatePassword ');
        return callback(error,rows);
    });
}
module.exports = {
    createPolice,
    queryPolice,
    queryPoliceInfo,
    updateInfo,
    updatePassword
}