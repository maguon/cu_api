'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserShipAddressDAO.js');
const db = require('../db/connection/MysqlDb.js');

const addUserShipAddress = (params,callback) => {
    let query = " insert into user_ship_address(user_id,address,detail_address,user_name,phone) " +
        " values(?,?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.address;
    paramsArray[i++] = params.detailAddress;
    paramsArray[i++] = params.userName;
    paramsArray[i] = params.phone;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addUserShipAddress');
        callback(error,rows);
    })
}
const getUserShipAddress = (params,callback) => {
    let query = "select * from user_ship_address where id is not null ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and user_id = ? ";
    }
    if(params.userShipAddressId){
        paramsArray[i++] = params.userShipAddressId;
        query = query + " and id = ? ";
    }
    if(params.start&&params.size){
        paramsArray[i++] = parseInt(params.start);
        paramsArray[i] = parseInt(params.size);
        query = query + " limit ?, ? ";
    }
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('getUserShipAddress');
        callback(error,rows);
    })
}
module.exports = {
    addUserShipAddress,
    getUserShipAddress
}