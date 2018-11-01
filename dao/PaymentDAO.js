'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('PaymentDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const getPayment = (params,callback) => {
    let query = "select * from payment_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.orderId){
        paramsArray[i] = params.orderId;
        query = query + " and order_id =? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getPayment');
        callback(error,rows);
    })
}
module.exports = {
    getPayment
}