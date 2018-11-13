'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('ProductDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addProduct = (params,callback) => {
    let query = "insert into product_info(freight,product_name,original_price,unit_price,type,product_remark)values(?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.freight;
    paramsArray[i++] = params.productName;
    paramsArray[i++] = params.originalPrice;
    paramsArray[i++] = params.unitPrice;
    paramsArray[i++] = params.type;
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
        paramsArray[i++] = params.productId;
        query = query + " and id = ? ";
    }
    if(params.productName){
        paramsArray[i++] = params.productName;
        query = query + " and product_Name = ? ";
    }
    if(params.type){
        paramsArray[i++] = params.type;
        query = query + " and type) = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and status = ? ";
    }
    if(params.createdOnStart){
        paramsArray[i++] = params.createdOnStart+" 00:00:00";
        query = query + " and created_on >= ? ";
    }
    if(params.createdOnEnd){
        paramsArray[i++] = params.createdOnEnd+" 23:59:59";
        query = query + " and created_on <= ? ";
    }
    query = query + " order by id asc ";
    if(params.start && params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getProduct');
        callback(error,rows);
    })
}
const getProductToOrderItem = (params,callback) => {
    let query = "insert into order_item(imag,remark,car_id,freight,user_id,order_id,product_id,product_name,unit_price,prod_count,total_price)(?,?,?,?,?,?,?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.productId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getProduct');
        callback(error,rows);
    })
}
const updateStatus = (params,callback) => {
    let query = " update product_info set status = ? where id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i] = params.productId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateStatus');
        callback(error,rows);
    })
}
module.exports = {
    addProduct,
    getProduct,
    getProductToOrderItem,
    updateStatus
}