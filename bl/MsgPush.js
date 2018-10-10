
var sysMsg = require('../util/SystemMsg.js');
var sysError = require('../util/SystemError.js');
var resUtil = require('../util/ResponseUtil.js');
var msgPushDAO = require('../dao/MsgPushDAO.js');
var serverLogger = require('../util/ServerLogger.js');
var logger = serverLogger.createLogger('MsgPush.js');

function pushMsg(req,res,next){
    var params = req.params ;
    params.title = "消息";
    params.content ="你的车被交警视为违章停车";
    msgPushDAO.pushMsg(params,function(error,result){
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
    pushMsg : pushMsg
}
