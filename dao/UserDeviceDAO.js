'use strict';
let db=require('../db/connection/MysqlDb.js');
let serverLogger = require('../util/ServerLogger.js');
let logger = serverLogger.createLogger('UserDeviceDAO.js');

const addUserDevice=(params,callback)=>{
    let query = " insert into user_device (user_id,device_token,version,app_type,device_type) values ( ? , ? , ? , ? , ? )";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.userId;
    paramsArray[i++]=params.deviceToken;
    paramsArray[i++]=params.version;
    paramsArray[i++]=params.appType;
    paramsArray[i]=params.deviceType;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' addUserDevice ');
        return callback(error,rows);
    });
}

const getUserDevice=(params,callback)=>{
    let query = " select ud.* from user_device ud " +
        " left join user_info u on ud.user_id = u.uid where ud.id is not null ";
    let paramsArray=[],i=0;
    if(params.userDeviceId){
        paramsArray[i++] = params.userDeviceId;
        query = query + " and ud.id = ? ";
    }
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ud.user_id = ? ";
    }
    if(params.deviceToken){
        paramsArray[i++] = params.deviceToken;
        query = query + " and ud.device_token = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' getUserDevice ');
        return callback(error,rows);
    });
}

const updateUserDevice=(params,callback)=>{
    let query = " update user_device set updated_on = ? where user_id = ? ";
    let paramsArray=[],i=0;
    paramsArray[i++] = params.updatedOn;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' updateUserDevice ');
        return callback(error,rows);
    });
}

const deleteUserDevice=(params,callback)=>{
    let query = " delete from user_device where id is not null ";
    let paramsArray=[],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.deviceToken){
        paramsArray[i++] = params.deviceToken;
        query = query + " and device_token = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug(' deleteUserDevice ');
        return callback(error,rows);
    });
}


module.exports ={
    addUserDevice,
    getUserDevice,
    updateUserDevice,
    deleteUserDevice
}