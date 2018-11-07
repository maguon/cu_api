'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('log.js');
const logDAO = require('../dao/LogDAO.js');
const orderDAO = require('../dao/OrderDAO.js');

const addLog = (req,res,next)=>{
    let params = req.params;
    new Promise((resolve,reject)=>{
        orderDAO.getOrder({orderId:params.orderId},(error,rows)=>{
            if(error){
                logger.error('getOrder' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else if(rows && rows.length < 1){
                logger.warn('getOrder '+'没有此订单');
                resUtil.resetFailedRes(res,'没有此订单',null);
            }else{
                logger.info('getOrder '+ 'success');
                params.userId = rows[0].user_id;
                resolve();
            }
        })
    }).then(()=>{
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
    })
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