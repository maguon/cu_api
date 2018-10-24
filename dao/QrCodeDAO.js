'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('QrCodeDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getQrCode = (params,callback) => {
    const url = '/stg.myxxjs.com/';
    const paramObj = {
        appid : sysConfig.wechatConfig.mpAppId,
        secret : sysConfig.wechatConfig.mpSecret,
        code : params.code,
        grant_type : 'authorization_code'
    }
    httpUtil.httpsGet(sysConfig.hosts,443,url,paramObj,(err,res)=>{
        logger.debug('getUserIdByCode');
        callback(err,res);
    })
}
module.exports = {
    getQrCode
}