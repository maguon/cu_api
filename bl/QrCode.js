'use strict';
const serializer = require('serializer');
const serverLogger = require('../util/ServerLogger.js');
const resUtil = require('../util/ResponseUtil.js');
const sysMsg = require('../util/SystemMsg.js');
const sysError = require('../util/SystemError.js');
const logger = serverLogger.createLogger('QrCode.js');
const qrCodeDAO = require('../dao/QrCodeDAO.js');

const getQrCode = (req,res,next)=>{
    let params = req.params;
    let result = serializer.parse(params.qrCode);
    //交警

    resUtil.resetQueryRes(res,result,null);
    return next();
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
    resUtil.resetQueryRes(res,{code:qrCodeString},null);
    return next();
}
module.exports = {
    getQrCode,createQrCode
}