'use strict';
const serverLogger = require('../util/ServerLogger.js');
const logger = serverLogger.createLogger('UserShipAddressDAO.js');
const db = require('../db/connection/MysqlDb.js');

const addUserShipAddress = (params,callback) => {
    let query = " insert into user_ship_address(user_id,address,user_name,phone) " +
                " values(?,?,?,?) ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.userId;
    paramsArray[i++] = params.address;
    paramsArray[i++] = params.userName;
    paramsArray[i] = params.phone;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('addUserShipAddress');
        callback(error,rows);
    })
}
const getUserShipAddress = (params,callback) => {
    let query = " select ui.wechat_name,usa.created_on,usa.updated_on,usa.id,usa.address,usa.user_name as ship_name,usa.phone as ship_phone,usa.status,usa.type,ui.phone,ui.user_name from user_ship_address usa " +
                " left join user_info ui on ui.id=usa.user_id " +
                " where usa.id is not null  ";
    let paramsArray = [],i=0;
    if(params.userId){
        paramsArray[i++] = params.userId;
        query = query + " and usa.user_id = ? ";
    }
    if(params.shipAddressId){
        paramsArray[i++] = params.shipAddressId;
        query = query + " and usa.id = ? ";
    }
    if(params.shipName){
        paramsArray[i++] = params.shipName;
        query = query + " and usa.user_name = ? ";
    }
    if(params.shipPhone){
        paramsArray[i++] = params.shipPhone;
        query = query + " and usa.phone = ? ";
    }
    if(params.userName){
        paramsArray[i++] = params.userName;
        query = query + " and ui.user_name = ? ";
    }
    if(params.phone){
        paramsArray[i++] = params.phone;
        query = query + " and ui.phone = ? ";
    }
    if(params.status){
        paramsArray[i++] = params.status;
        query = query + " and usa.status = ? ";
    }
    query = query + " order by usa.id asc ";
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
const updateUserShipAddressById = (params,callback) => {
    let query = " update user_ship_address set status = ? where id=? and user_id =?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.status;
    paramsArray[i++] = params.shipAddressId;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUserShipAddressById');
        callback(error,rows);
    })
}
const updateUserShipAddress = (params,callback) => {
    let query = " update user_ship_address set status = 0 where user_id=? ";
    let paramsArray = [],i=0;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUserShipAddress');
        callback(error,rows);
    })
}
const updateUserShip = (params,callback) => {
    let query = " update user_ship_address set address = ?,phone=?,user_name=? where id=? and user_id=? ";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.address;
    paramsArray[i++] = params.phone;
    paramsArray[i++] = params.userName;
    paramsArray[i++] = params.shipAddressId;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('updateUserShip');
        callback(error,rows);
    })
}
const deleteUserShipAddress = (params,callback) => {
    let query = " delete from user_ship_address where id=? and user_id=?";
    let paramsArray = [],i=0;
    paramsArray[i++] = params.shipAddressId;
    paramsArray[i] = params.userId;
    db.dbQuery(query,paramsArray,(error,rows)=>{
        logger.debug('deleteUserShipAddress');
        callback(error,rows);
    })
}
module.exports = {
    addUserShipAddress,
    getUserShipAddress,
    updateUserShipAddress,
    updateUserShipAddressById,
    updateUserShip,
    deleteUserShipAddress
}