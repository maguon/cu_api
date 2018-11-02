'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('CourierDAO.js');
const sysConfig = require("../config/SystemConfig");
const httpUtil = require('../util/HttpUtil');
const db = require('../db/connection/MysqlDb.js');

const addCourier = (params,callback) => {
    let query = "insert into courier_info(product_name,product_count,order_id,courier_num,courier_company,remark,send_name,send_phone,recv_name,recv_phone,recv_address)values(?,?,?,?,?,?,?,?,?,?,?)";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.productName;
    paramsArray[i++] = params.productCount;
    paramsArray[i++] = params.orderId;
    paramsArray[i++] = params.courierNum;
    paramsArray[i++] = params.courierCompany;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.sendName;
    paramsArray[i++] = params.sendPhone;
    paramsArray[i++] = params.recvName;
    paramsArray[i++] = params.recvPhone;
    paramsArray[i] = params.recvAddress;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addCourier');
        callback(error,rows);
    })
}
const getCourier = (params,callback) => {
    let query = " select ci.*,oi.id,oi.total_price,oi.recv_name,oi.recv_phone,oi.recv_address,oi.total_freight from courier_info ci " +
                " left join order_info oi on oi.id=ci.order_id " +
                " where ci.id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and ci.user_id =? ";
    }
    if(params.orderId){
        paramsArray[i++] = params.orderId;
        query = query + " and ci.order_id =? ";
    }
    if(params.courierId){
        paramsArray[i] = params.courierId;
        query = query + " and ci.id =? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getCourier');
        callback(error,rows);
    })
}
const updateCourier = (params,callback) => {
    let query = "update courier_info set product_name=?,product_count=?,remark=?,send_name=?,send_phone=?,recv_name=?,recv_phone=?,recv_address=? where id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.productName;
    paramsArray[i++] = params.productCount;
    paramsArray[i++] = params.remark;
    paramsArray[i++] = params.sendName;
    paramsArray[i++] = params.sendPhone;
    paramsArray[i++] = params.recvName;
    paramsArray[i++] = params.recvPhone;
    paramsArray[i++] = params.recvAddress;
    paramsArray[i] = params.courierId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateCourier');
        callback(error,rows);
    })
}
module.exports = {
    addCourier,
    getCourier,
    updateCourier
}