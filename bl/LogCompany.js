'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('LogCompany.js');
const logCompanyDAO = require('../dao/LogCompanyDAO.js');

const addLogCompany = (req,res,next)=>{
    let params = req.params;
    logCompanyDAO.addLogCompany(params,(error,result)=>{
        if(error){
            logger.error('addLogCompany' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addLogCompany '+'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const getLogCompany = (req,res,next)=>{
    let params = req.params;
    logCompanyDAO.getLogCompany(params,(error,result)=>{
        if(error){
            logger.error('getLogCompany' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getLogCompany '+'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const updateLogCompany = (req,res,next)=>{
    let params = req.params;
    logCompanyDAO.updateLogCompany(params,(error,result)=>{
        if(error){
            logger.error('updateLogCompany' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateLogCompany '+'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports = {
    addLogCompany,
    getLogCompany,
    updateLogCompany
}