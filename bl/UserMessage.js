'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('UserMessage.js');
const userMessageDAO = require('../dao/UserMessageDAO.js');

const addMessage = (req,res,next)=>{
    let params = req.params;
    userMessageDAO.addMessage(params,(error,result)=>{
        if(error){
            logger.error('addMessage' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('addMessage' + 'success');
            resUtil.resetCreateRes(res,result,null);
            return next();
        }
    });
}
const getMessage = (req,res,next)=>{
    let params = req.params;
    userMessageDAO.getMessage(params,(error,result)=>{
        if(error){
            logger.error('getMessage' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getMessage' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
const queryUserMessageNumById = (req,res,next)=>{
    let params = req.params;
    userMessageDAO.queryUserMessageNumById(params,(error,result)=>{
        if(error){
            logger.error('queryUserMessageNumById' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('queryUserMessageNumById' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
};
const updateUserMessageStatus = (req,res,next)=>{
    let params = req.params;
    userMessageDAO.updateUserMessageStatus(params,(error,result)=>{
        if(error){
            logger.error('updateUserMessageStatus' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateUserMessageStatus' + 'success');
            resUtil.resetUpdateRes(res,result,null);
            return next();
        }
    });
};
module.exports = {
    addMessage,
    getMessage,
    queryUserMessageNumById,
    updateUserMessageStatus
}