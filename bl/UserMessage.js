'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('UserMessage.js');
const userMessageDAO = require('../dao/UserMessageDAO.js');
const moment = require('moment/moment.js');

const addMessage = (req,res,next)=>{
    let params = req.params;
    let myDate = new date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    userMessageDAO.addMessage(params,(error,result)=>{
        if(error){
            logger.error('addMessage ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('addMessage ' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const getMessage = (req,res,next)=>{
    let params = req.params;
    userMessageDAO.getMessage(params,(error,result)=>{
        if(error){
            logger.error('getMessage ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getMessage ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
const queryUserMessageNumById = (req,res,next)=>{
    let params = req.params;
    userMessageDAO.queryUserMessageNumById(params,(error,result)=>{
        if(error){
            logger.error('queryUserMessageNumById ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('queryUserMessageNumById ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
const updateUserMessageStatus = (req,res,next)=>{
    let params = req.params;
    userMessageDAO.updateUserMessageStatus(params,(error,result)=>{
        if(error){
            logger.error('updateUserMessageStatus ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('updateUserMessageStatus ' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
const getUserMessageStatByDay = (req,res,next)=>{
    let params = req.params;
    let myDate = new Date();
    params.dateId = moment(myDate).format('YYYYMMDD');
    let myDateSize = myDate.setDate(myDate.getDate()-params.dateSize);
    params.dateIdStart = moment(myDateSize).format('YYYYMMDD');
    userMessageDAO.getUserMessageStatByDay(params,(error,result)=>{
        if(error){
            logger.error('getUserMessageStatByDay ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getUserMessageStatByDay ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
const getUserMessageStatByMonth = (req,res,next)=>{
    let params = req.params;
    userMessageDAO.getUserMessageStatByMonth(params,(error,result)=>{
        if(error){
            logger.error('getUserMessageStatByMonth ' + error.message);
            resUtil.resInternalError(error, res, next);
        }else{
            logger.info('getUserMessageStatByMonth ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
module.exports = {
    addMessage,
    getMessage,
    queryUserMessageNumById,
    updateUserMessageStatus,
    getUserMessageStatByDay,
    getUserMessageStatByMonth
}