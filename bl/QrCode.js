'use strict';
const serializer = require('serializer');
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('QrCode.js');
const qrCodeDAO = require('../dao/QrCodeDAO.js');
const userCarDAO = require('../dao/UserCarDAO.js');

const getQrCode = (req,res,next)=>{
    let params = req.params;
    let userType = req.headers['user-type'] ;
    let result = serializer.parse(params.qrCode);
    if(userType==0){
        userCarDAO.queryUserCar({userCarId:result[1]},(error,result)=>{
            if(error){
                logger.error('getQrCode queryCheckCar ' + error.message);
                throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
            }else{
                logger.info('getQrCode queryCheckCar ' + 'success');
                resUtil.resetQueryRes(res,result,null);
                return next();
            }
        })
    }else{
        //resUtil.resetQueryRes(res,{success:true},null);

        logger.warn('getQrCode userType is not Supervise!');
        resUtil.resetFailedRes(res,'No query permissions!',null);

    }
    /*oauthUtil.getQrCode({qrCodeId:params.qrCodeId},(error,result)=>{
        if(error){
            logger.error('getQrCode' + error.message);
            throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
        }else{
            logger.info('getQrCode' + 'success');
            resUtil.resetQueryRes(res,result,null);
            return next();
        }
    });*/
};
const createQrCode = (req,res,next) =>{
    let params = req.params;
    let qrCodeString = serializer.stringify([params.userId,params.userCarId]);
    if(qrCodeString){
        logger.info('createQrCode ' + 'success');
        resUtil.resetQueryRes(res,{code:qrCodeString},null);
        return next();
    }else{
        logger.error('createQrCode error! ');
        throw sysError.InternalError(error.message,sysMsg.SYS_INTERNAL_ERROR_MSG);
    }

}
module.exports = {
    getQrCode,createQrCode
}