'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ProductDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addProduct = (params,callback) => {
    let query = "insert into product_info(product_name,original_price,unit_price,product_remark)values(?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.productName;
    paramsArray[i++] = params.originalPrice;
    paramsArray[i++] = params.unitPrice;
    paramsArray[i] = params.productRemark;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addProduct');
        callback(error,rows);
    })
}
const getProduct = (params,callback) => {
    let query = "select * from product_info where id is not null ";
    let paramsArray = [],i=0;
    if(params.productId){
        paramsArray[i] = params.productId;
        query = query + " and id = ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getProduct');
        callback(error,rows);
    })
}
module.exports = {
    addProduct,
    getProduct
}