'use strict';
let db=require('../db/connection/MysqlDb.js');
let serverLogger = require('../util/ServerLogger.js');
let logger = serverLogger.createLogger('SuperviseDeviceDAO.js');

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


module.exports ={
    addSuperviseDevice,
    getSuperviseDevice,
    updateSuperviseDevice,
    deleteSuperviseDevice
}