'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('QrCodeDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getQrCode = (params,callback) => {
    let query = "select * from user_check_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.userCarId){
        paramsArray[i] = params.userCarId;
        query = query + " and car_id = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getQrCode');
        callback(error,rows);
    })
}
module.exports = {
    getQrCode
}