/**
 * Created by lingxue on 2017/4/24.
 */
'use strict';
let serverLogger = require('../util/ServerLogger.js');
let logger = serverLogger.createLogger('SysRecordDAO.js');
let httpUtil =  require('../util/HttpUtil.js');
let sysConfig =  require('../config/SystemConfig.js');

const addCheckRecord=(req,params,callback)=>{
    let url = '/api/user/'+params.userId+'/check/'+params.checkId;
    httpUtil.httpPost(sysConfig.hosts.record,url,req,params,(error,result)=>{
        callback(error,result);
    })
}

/*function addTruckRecord(req,params,callback){
    var url = '/api/truckRecord';
    httpUtil.httpPost(sysConfig.hosts.record,url,req,params,function(error,result){
        callback(error,result);
    })
}

function addDriverRecord(req,params,callback) {
    var url = '/api/tuser/'+params.tid+'/record';
    httpUtil.httpPost(sysConfig.hosts.record,url,req,params,function(error,result){
        callback(error,result);
    })
}

function addRouteRecord(req,params,callback) {
    var url = '/api/routeRecord';
    httpUtil.httpPost(sysConfig.hosts.record,url,req,params,function(error,result){
        callback(error,result);
    })
}

function addReceiverRecord(req,params,callback) {
    var url = '/api/receiverRecord';
    httpUtil.httpPost(sysConfig.hosts.record,url,req,params,function(error,result){
        callback(error,result);
    })
}

function addEntrustRecord(req,params,callback){
    var url = '/api/entrust/'+params.entrustId+'/cityRouteId/'+params.cityRouteId+"/entrustRecord";
    httpUtil.httpPost(sysConfig.hosts.record,url,req,params,function(error,result){
        callback(error,result);
    })
}*/

module.exports ={
    addCheckRecord
}