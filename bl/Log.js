'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('log.js');
const logDAO = require('../dao/LogDAO.js');

const addLog = (req,res,next)=>{
    let params = req.params;
    logDAO.addLog(params,(error,result)=>{
        if(error){
            logger.error('addLog' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addLog' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const getLog = (req,res,next)=>{
    let params = req.params;
    logDAO.getLog(params,(error,result)=>{
        if(error){
            logger.error('getLog' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getLog' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const updateLog = (req,res,next)=>{
    let params = req.params;
    logDAO.updateLog(params,(error,result)=>{
        if(error){
            logger.error('updateLog' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateLog' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
}
module.exports = {
    addLog,
    getLog,
    updateLog
}