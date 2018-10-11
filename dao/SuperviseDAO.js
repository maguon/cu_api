'use strict';

const db=require('../db/connection/MysqlDb.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('SuperviseDAO.js');

const createSupervise = (params,callback) => {
    let query = " insert into supervise_info (user_name,gender,password,status,phone) values ( ?,? , ? , ? , ?  )";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.userName;
    paramsArray[i++]=params.gender;
    paramsArray[i++]=params.password;
    paramsArray[i++]=params.status;
    paramsArray[i]=params.phone;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' createSupervise ');
        return callback(error,rows);
    });
}
const querySupervise = (params,callback) => {
    let query = " select * from supervise_info where id is not null ";
    let paramsArray=[],i=0;
    if(params.superviseId){
        paramsArray[i++] = params.superviseId;
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
        logger.debug(' querySupervise ');
        return callback(error,rows);
    });
}
const getSuperviseInfo = (params,callback) => {
    let query = " select pi.user_name,pi.phone,pi.gender,date_format(pi.created_on,'%Y年%m月%d日') as date from police_info pi" +
                " left join car_info ci on ci.supervise_id=pi.id" +
                " where str_to_date(ci.created_on,'%Y-%m-%d') = ?";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.createdDateId;
        query = query + " and pi.id = ? ";
        paramsArray[i]=params.superId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' querySuperviseInfo ');
        return callback(error,rows);
    })
}
const updateInfo = (params,callback) => {
    let query = " update supervise_info set gender = ? ,phone = ? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.gender;
    paramsArray[i++] = params.phone;
    paramsArray[i] = params.superviseId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateInfo ');
        return callback(error,rows);
    });
}
const updatePassword = (params,callback) => {
    let query = " update supervise_info set password = ? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.password;
    paramsArray[i] = params.superviseId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updatePassword ');
        return callback(error,rows);
    });
}
const updatePhone = (params,callback) => {
    let query = " update supervise_info set phone = ? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.phone;
    paramsArray[i] = params.superviseId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updatePhone ');
        return callback(error,rows);
    });
}
module.exports = {
    createSupervise,
    querySupervise,
    getSuperviseInfo,
    updateInfo,
    updatePassword,
    updatePhone
}