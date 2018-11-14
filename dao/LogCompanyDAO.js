'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('PaymentDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addLogCompany = (params,callback) => {
    let query = " insert into log_company(company_name,phone,remark) values(?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.companyName;
    paramsArray[i++] = params.phone;
    paramsArray[i] = params.remark;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addLogCompany');
        callback(error,rows);
    })
}
const getLogCompany = (params,callback) => {
    let query = " select * from log_company where id is not null ";
    let paramsArray = [],i=0;
    if(params.logCompanyId){
        paramsArray[i++] = params.logCompanyId;
        query = query + " and id = ? ";
    }
    if(params.companyName){
        paramsArray[i++] = params.companyName;
        query = query + " and company_name = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and phone = ? ";
    }
    query = query + " order by id asc ";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getLogCompany');
        callback(error,rows);
    })
}
const updateLogCompany = (params,callback) => {
    let query = " update log_company set company_name=?,phone=?,remark=? where id = ?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.companyName;
    paramsArray[i++] = params.phone;
    paramsArray[i++] = params.remark;
    paramsArray[i] = params.logCompanyId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateLogCompany');
        callback(error,rows);
    })
}
module.exports = {
    addLogCompany,
    getLogCompany,
    updateLogCompany
}