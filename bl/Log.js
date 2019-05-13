'use strict';
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('log.js');
const logDAO = require('../dao/LogDAO.js');
const orderDAO = require('../dao/OrderDAO.js');
const moment = require('moment/moment.js');

const addLog = (req,res,next)=>{
    let params = req.params;

    new Promise((resolve,reject)=>{
        orderDAO.getOrder({orderId:params.orderId},(error,rows)=>{
            if(error){
                logger.error('addLog getOrder ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else if(rows && rows.length < 1){
                logger.warn('addLog getOrder '+'There is no such order.');
                resUtil.resetFailedRes(res,'没有此订单',null);
            }else{
                logger.info('addLog getOrder '+ 'success');
                params.userId = rows[0].user_id;
                params.freight = rows[0].total_freight;
                params.remark = rows[0].remark;
                resolve();
            }
        })
    }).then(()=>{
        let myDate = new Date();
        params.dateId = moment(myDate).format('YYYYMMDD');
        logDAO.addLog(params,(error,result)=>{
            if(error){
                logger.error('addLog logDao_add ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else{
                logger.info('addLog logDao_add ' + 'success');
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
            logger.error('getLog ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getLog ' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });
}
const updateLog = (req,res,next)=>{
    let params = req.params;
    logDAO.updateLog(params,(error,result)=>{
        if(error){
            logger.error('updateLog ' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('updateLog ' + 'success');
            orderDAO.updateOrderLogStatusByAdmin({orderId:params.orderId},(error,result)=>{});
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