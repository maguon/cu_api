'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('PaymentDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addLogCompany = (params,callback) => {
    let query = " insert into log_company (company_name) values(?)";
    let paramsArray = [],i=0;
    paramsArray[i] = params.companyName;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addLogCompany');
        callback(error,rows);
    })
}
const getLogCompany = (params,callback) => {
    let query = " select * from log_company where id is not null ";
    let paramsArray = [],i=0;
    if(params.logCompanyId){
        query = query + " and id = ? ";
        paramsArray[i] = params.logCompanyId;
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getLogCompany');
        callback(error,rows);
    })
}
module.exports = {
    addLogCompany,
    getLogCompany
}