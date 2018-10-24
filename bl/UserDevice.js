'use strict';
let sysMsg = require('../util/SystemMsg.js');
let sysError = require('../util/SystemError.js');
let resUtil = require('../util/ResponseUtil.js');
let encrypt = require('../util/Encrypt.js');
let listOfValue = require('../util/ListOfValue.js');
let userDeviceDAO = require('../dao/UserDeviceDAO.js');
let oAuthUtil = require('../util/OAuthUtil.js');
let serverLogger = require('../util/ServerLogger.js');
let logger = serverLogger.createLogger('UserDevice.js');

const createUserDevice=(req,res,next)=>{
    let params = req.params ;
    userDeviceDAO.addUserDevice(params,(error,result)=>{
        if (error) {
            logger.error(' createUserDevice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createUserDevice ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const queryUserDevice=(req,res,next)=>{
    let params = req.params ;
    userDeviceDAO.getUserDevice(params,(error,result)=>{
        if (error) {
            logger.error(' queryUserDevice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryUserDevice ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const removeUserDevice=(req,res,next)=>{
    let params = req.params;
    userDeviceDAO.deleteUserDevice(params,(error,result)=>{
        if (error) {
            logger.error(' removeUserDevice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeUserDevice ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    createUserDevice,
    queryUserDevice,
    removeUserDevice
}