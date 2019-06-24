/**
 * Created by lingxue on 2017/4/24.
 */
'use strict';
let sysRecordDAO = require('../dao/SysRecordDAO.js');
let serverLogger = require('../util/ServerLogger.js');
let logger = serverLogger.createLogger('SysRecord.js');

const saveCheckRecord=(req,res,next)=>{
    if(res._body.success){
        let params = req.params;
        console.log(params);
        let recordParams ={};
        recordParams.userId = params.userId;
        recordParams.userType = params._utype || 99;
        recordParams.username = params._uname || 'admin';
        recordParams.content = params.checkContent;
        recordParams.checkId = params.checkId;
        recordParams.carNo = params.carNo;
        sysRecordDAO.addCheckRecord(req,recordParams,(error,result)=>{
            if(error){
                logger.error('saveCheckRecord addCheckRecord ' + error.stack);
            }else{
                logger.info('saveCheckRecord addCheckRecord success')
            }
            return next();
        })
    }else{
        return next();
    }
}

module.exports ={
    saveCheckRecord
}