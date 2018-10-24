'use strict';
let sysMsg = require('../util/SystemMsg.js');
let sysError = require('../util/SystemError.js');
let resUtil = require('../util/ResponseUtil.js');
let encrypt = require('../util/Encrypt.js');
let listOfValue = require('../util/ListOfValue.js');
let superviseDeviceDAO = require('../dao/SuperviseDeviceDAO.js');
let oAuthUtil = require('../util/OAuthUtil.js');
let serverLogger = require('../util/ServerLogger.js');
let logger = serverLogger.createLogger('SuperviseDevice.js');

const createSuperviseDevice=(req,res,next)=>{
    let params = req.params ;
    superviseDeviceDAO.addSuperviseDevice(params,(error,result)=>{
        if (error) {
            logger.error(' createSuperviseDevice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createSuperviseDevice ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const querySuperviseDevice=(req,res,next)=>{
    let params = req.params ;
    superviseDeviceDAO.getSuperviseDevice(params,(error,result)=>{
        if (error) {
            logger.error(' querySuperviseDevice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' querySuperviseDevice ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const removeSuperviseDevice=(req,res,next)=>{
    let params = req.params;
    superviseDeviceDAO.deleteSuperviseDevice(params,(error,result)=>{
        if (error) {
            logger.error(' removeSuperviseDevice ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' removeSuperviseDevice ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    createSuperviseDevice,
    querySuperviseDevice,
    removeSuperviseDevice
}