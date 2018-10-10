'use strict';
let sysMsg = require('../util/SystemMsg.js');
let sysError = require('../util/SystemError.js');
let resUtil = require('../util/ResponseUtil.js');
let msgPushDAO = require('../dao/MsgPushDAO.js');
let serverLogger = require('../util/ServerLogger.js');
let logger = serverLogger.createLogger('MsgPush.js');

const pushMsg=(req,res,next)=>{
    let params = req.params ;
    params.title = "消息";
    params.content ="你的车被交警视为违章停车";
    msgPushDAO.pushMsg(params,(error,result)=>{
        if (error) {
            logger.error(' pushMsg ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        } else {
            logger.info(' pushMsg ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    })
}


module.exports={
    pushMsg
}
