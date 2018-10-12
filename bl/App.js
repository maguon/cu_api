'use strict';
let sysMsg = require('../util/SystemMsg.js');
let sysError = require('../util/SystemError.js');
let resUtil = require('../util/ResponseUtil.js');
let listOfValue = require('../util/ListOfValue.js');
let appDAO = require('../dao/AppDAO.js');
let serverLogger = require('../util/ServerLogger.js');
let logger = serverLogger.createLogger('App.js');

const queryApp=(req,res,next)=>{
    let params = req.params ;
    appDAO.queryApp(params,function(error,result){
        if (error) {
            logger.error(' queryApp ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' queryApp ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}
const createAppVersion=(req,res,next)=>{
    let params = req.params ;
    appDAO.addAppVersion(params,function(error,result){
        if (error) {
            logger.error(' createAppVersion ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' createAppVersion ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    })
}
const updateAppVersion=(req,res,next)=>{
    let params = req.params ;
    appDAO.updateAppVersion(params,function(error,result){
        if (error) {
            logger.error(' updateAppVersion ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' updateAppVersion ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    })
}
module.exports={
    createAppVersion,
    queryApp,
    updateAppVersion
}