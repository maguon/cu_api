'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('UserShipAddress.js');
const userShipAddressDAO = require('../dao/UserShipAddressDAO.js');

const addUserShipAddress = (req,res,next)=>{
    let params = req.params;
    userShipAddressDAO.addUserShipAddress(params,(error,result)=>{
        if(error){
            logger.error('addUserShipAddress' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addUserShipAddress' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
};
const getUserShipAddress = (req,res,next)=>{
    let params = req.params;
    userShipAddressDAO.getUserShipAddress(params,(error,result)=>{
        if(error){
            logger.error('getUserShipAddress' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getUserShipAddress' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
module.exports = {
    addUserShipAddress,
    getUserShipAddress
}