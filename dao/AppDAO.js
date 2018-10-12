'use strict';
let db=require('../db/connection/MysqlDb.js');
let serverLogger = require('../util/ServerLogger.js');
let logger = serverLogger.createLogger('AppDAO.js');

const queryApp=(params,callback)=>{
    let query = " select id,app,type,version,force_update,url,remark,created_on,updated_on from app_version where id is not null ";
    let paramsArray=[],i=0;
    if(params.appId){
        query = query + " and id = ? ";
        paramsArray[i++]=params.appId;
    }
    if(params.type){
        query = query + " and type = ? ";
        paramsArray[i++]=params.type;
    }
    if(params.app){
        query = query + " and app = ? ";
        paramsArray[i++]=params.app;
    }
    if(params.forceUpdate){
        query = query + " and force_update = ? ";
        paramsArray[i++]=params.forceUpdate;
    }
    query = query + '  order by id desc ';
    if (params.start && params.size) {
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i++] = parseInt(params.size);
        query += " limit ? , ? "
    }
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' queryApp ');
        return callback(error,rows);
    });
}

const addAppVersion=(params,callback)=>{
    let query = " insert into app_version (app,type,version,force_update,url,remark)  values (? , ? , ? , ? , ? , ?)";
    let paramsArray=[],i=0;
    paramsArray[i++]=params.app;
    paramsArray[i++]=params.appType;
    paramsArray[i++]=params.version;
    paramsArray[i++]=params.forceUpdate;
    paramsArray[i++]=params.url;
    paramsArray[i]=params.remark;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' addAppVersion ');
        return callback(error,rows);
    });
}

const updateAppVersion=(params,callback)=>{
    let query = " update app_version set app = ? ,type = ?  ,version = ?,  force_update = ? ,url = ?  ,remark = ? where id = ? " ;
    let paramsArray=[],i=0;
    paramsArray[i++]=params.app;
    paramsArray[i++]=params.appType;
    paramsArray[i++]=params.version;
    paramsArray[i++]=params.forceUpdate;
    paramsArray[i++]=params.url;
    paramsArray[i++]=params.remark;
    paramsArray[i]=params.appId;
    db.dbQuery(query,paramsArray,function(error,rows){
        logger.debug(' updateAppVersion ');
        return callback(error,rows);
    });
}
module.exports ={
    queryApp : queryApp ,
    updateAppVersion : updateAppVersion ,
    addAppVersion : addAppVersion
}
