'use strict';

const db=require('../db/connection/MysqlDb.js');
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('SuperviseDAO.js');

const createSupervise = (params,callback) => {
    let query = " insert into supervise_info (user_name,gender,password,status,type,phone) values ( ?,? , ? , ? ,?, ?  )";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.userName;
    paramsArray[i++]=params.gender;
    paramsArray[i++]=params.password;
    paramsArray[i++]=params.status;
    paramsArray[i++]=params.type;
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
    if(params.gender){
        paramsArray[i++] = params.gender;
        query = query + " and gender = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and type = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and phone = ? ";
    }
    if(params.start&&params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ? ";
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
    let query = " update supervise_info set avatar_image=?,gender = ? ,user_name=?,type=?,phone=? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.avatarImage;
    paramsArray[i++] = params.gender;
    paramsArray[i++] = params.userName;
    paramsArray[i++] = params.type;
    paramsArray[i++] = params.phone;
    paramsArray[i] = params.superviseId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateInfo ');
        return callback(error,rows);
    });
}
const updateSuperviseStatus = (params,callback) => {
    let query = " update supervise_info set status=? where id = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.superviseId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateSuperviseStatus ');
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
const updatePasswordByPhone = (params,callback) => {
    let query = " update supervise_info set password = ? where phone = ?";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.password;
    paramsArray[i] = params.phone;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updatePasswordByPhone ');
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
const getSuperviseDevice=(params,callback)=>{
    let query = " select ud.* from supervise_device ud " +
                " left join supervise_info u on ud.supervise_id = u.id where ud.id is not null ";
    let paramsArray=[],i=0;
    if(params.superviseDeviceId){
        paramsArray[i++] = params.superviseDeviceId;
        query = query + " and ud.id = ? ";
    }
    if(params.superviseId){
        paramsArray[i++] = params.superviseId;
        query = query + " and ud.supervise_id = ? ";
    }
    if(params.deviceToken){
        paramsArray[i++] = params.deviceToken;
        query = query + " and ud.device_token = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getSuperviseDevice ');
        return callback(error,rows);
    });
}
const updateSuperviseDevice=(params,callback)=>{
    let query = " update supervise_device set updated_on = ? where supervise_id = ? ";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.updatedOn;
    paramsArray[i] = params.superviseId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateSuperviseDevice ');
        return callback(error,rows);
    });
}
const deleteSuperviseDevice=(params,callback)=>{
    let query = " delete from supervise_device where id is not null ";
    let paramsArray=[],i=0;
    if(params.superviseId){
        paramsArray[i++] = params.superviseId;
        query = query + " and supervise_id = ? ";
    }
    if(params.deviceToken){
        paramsArray[i++] = params.deviceToken;
        query = query + " and device_token = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' deleteSuperviseDevice ');
        return callback(error,rows);
    });
}
const addSuperviseDevice=(params,callback)=>{
    let query = " insert into supervise_device (supervise_id,device_token,version,app_type,device_type) values ( ? , ? , ? , ? , ? )";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.superviseId;
    paramsArray[i++]=params.deviceToken;
    paramsArray[i++]=params.version;
    paramsArray[i++]=params.appType;
    paramsArray[i]=params.deviceType;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' addSuperviseDevice ');
        return callback(error,rows);
    });
}
module.exports = {
    createSupervise,
    querySupervise,
    getSuperviseInfo,
    updateInfo,
    updatePassword,
    updatePhone,
    updateSuperviseStatus,
    getSuperviseDevice,
    updateSuperviseDevice,
    deleteSuperviseDevice,
    addSuperviseDevice,
    updatePasswordByPhone
}